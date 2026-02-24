import type { EngineEventBus } from './event-bus.js';
import type { Brain } from '../modules/brain.js';
import type { Builder } from '../modules/builder.js';
import type { Packer } from '../modules/packer.js';
import type { Watcher } from '../modules/watcher.js';
import type { EngineState, EngineStage } from '../types.js';
import { createLog } from '../utils/logger.js';

export class CoreEngine {
  private readonly state: EngineState = {
    running: false,
    processing: false,
    stage: 'idle',
  };

  constructor(
    private readonly bus: EngineEventBus,
    private readonly watcher: Watcher,
    private readonly brain: Brain,
    private readonly builder: Builder,
    private readonly packer: Packer,
  ) {
    this.wireEvents();
  }

  getState(): EngineState {
    return { ...this.state };
  }

  start(): EngineState {
    if (this.state.running) {
      return this.getState();
    }

    this.state.running = true;
    this.setStage('watching');
    this.watcher.start();
    this.emitLog('success', 'Core engine is running.', 'CoreEngine');
    this.emitState();
    return this.getState();
  }

  stop(): EngineState {
    this.state.running = false;
    this.watcher.stop();
    if (!this.state.processing) {
      this.setStage('idle');
    }
    this.emitLog('warn', 'Core engine stopped by operator.', 'CoreEngine');
    this.emitState();
    return this.getState();
  }

  injectPrompt(prompt: string): void {
    this.bus.emit('prompt_ready', {
      prompt,
      raw: { source: 'manual-inject' },
    });
  }

  private wireEvents(): void {
    this.bus.on('tick', event => {
      this.state.lastTickAt = event.checkedAt;
      this.emitLog('info', `Watcher tick complete. Next poll in ${event.nextDelayMs}ms.`, 'Watcher');
      this.emitState();
    });

    this.bus.on('prompt_waiting', event => {
      this.emitLog('info', `Watcher idle: ${event.reason}`, 'Watcher');
    });

    this.bus.on('prompt_ready', event => {
      if (!this.state.running) {
        return;
      }

      if (this.state.processing) {
        this.emitLog('warn', 'Prompt received while processing is active. Ignored.', 'CoreEngine');
        return;
      }

      this.state.lastPromptAt = new Date().toISOString();
      this.state.processing = true;
      this.setStage('prompt_received');
      this.emitLog('success', 'Mystery prompt detected. Triggering execution pipeline.', 'Watcher');
      this.emitState();

      void this.executePipeline(event.prompt);
    });

    this.bus.on('error', event => {
      this.state.lastError = `${event.stage}: ${event.error.message}`;
      this.setStage('error');
      this.emitLog('error', event.error.message, event.stage.toUpperCase());
      this.emitState();
    });
  }

  private async executePipeline(prompt: string): Promise<void> {
    try {
      this.setStage('generating');
      this.emitLog('info', 'Stage 3 / The Brain started.', 'Brain');
      this.emitState();

      const artifact = await this.brain.generateFromPrompt(prompt);
      this.emitLog('success', `Brain produced ${artifact.files.length} files.`, 'Brain', {
        projectName: artifact.projectName,
      });

      this.setStage('building');
      this.emitLog('info', 'Stage 4 / The Builder started.', 'Builder');
      this.emitState();

      const buildResult = await this.builder.materialize(artifact);
      this.bus.emit('output_ready', buildResult);
      this.emitLog('success', `Builder wrote ${buildResult.filesWritten} files.`, 'Builder', {
        outputDir: buildResult.outputDir,
      });

      this.setStage('packing');
      this.emitLog('info', 'Stage 5 / The Packer started (zipping).', 'Packer');
      this.emitState();

      const zipResult = await this.packer.createZip(buildResult.outputDir);
      this.bus.emit('zipped', zipResult);
      this.emitLog('success', `Archive created (${zipResult.bytes} bytes).`, 'Packer', {
        zipPath: zipResult.zipPath,
      });

      this.setStage('submitting');
      this.emitLog('info', 'Submitting archive to Seedstr endpoint.', 'Packer');
      this.emitState();

      const submissionResult = await this.packer.submit(zipResult.zipPath);
      this.bus.emit('submitted', submissionResult);
      this.state.lastSubmissionId = submissionResult.submissionId;

      this.setStage('completed');
      this.emitLog('success', 'Submission completed successfully.', 'Packer', submissionResult);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.bus.emit('error', {
        stage: this.state.stage,
        error: err,
      });
    } finally {
      this.state.processing = false;
      if (this.state.running) {
        this.setStage('watching');
      }
      this.emitState();
    }
  }

  private setStage(stage: EngineStage): void {
    this.state.stage = stage;
  }

  private emitState(): void {
    this.bus.emit('state', { ...this.state });
  }

  private emitLog(level: 'info' | 'warn' | 'error' | 'success', message: string, source: string, meta?: unknown): void {
    const log = createLog(source, level, message, meta);
    console.log(`[${source}] [${level.toUpperCase()}] ${message}`);
    this.bus.emit('log', log);
  }
}
