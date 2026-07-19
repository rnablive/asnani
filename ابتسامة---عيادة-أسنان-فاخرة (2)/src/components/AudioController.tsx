/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";

// Standardize AudioContext across browsers
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  return AudioCtx ? new AudioCtx() : null;
};

class SoundSynth {
  private ctx: AudioContext | null = null;
  private ambientNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbiencePlaying: boolean = false;

  constructor() {
    // Context will be created on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = getAudioContext();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playClick() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playHover() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playHealing() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760]; // Sparkling arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const delay = idx * 0.08;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.03, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.7);
    });

    // Sub-harmonic sweeping pad for cinematic epic impact
    const sweepOsc = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    
    sweepOsc.type = "triangle";
    sweepOsc.frequency.setValueAtTime(110, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.05, now + 0.3);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);

    sweepOsc.start(now);
    sweepOsc.stop(now + 1.6);
  }

  public playSiren() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(261.63, now); // C4

    // Wailing effect over 5 seconds
    for (let i = 0; i < 5; i++) {
      osc1.frequency.linearRampToValueAtTime(783.99, now + i + 0.25); // G5
      osc1.frequency.linearRampToValueAtTime(523.25, now + i + 0.75); // C5

      osc2.frequency.linearRampToValueAtTime(392.00, now + i + 0.25); // G4
      osc2.frequency.linearRampToValueAtTime(261.63, now + i + 0.75); // C4
    }

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    gain.gain.setValueAtTime(0.04, now + 4.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 5.1);
    osc2.stop(now + 5.1);
  }

  public playExperienceHover() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    // Soft futuristic sweep
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.3);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 0.3);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.015, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playExperienceToggle(on: boolean) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    if (on) {
      // Celestial scale climbing up
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const delay = idx * 0.05;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.015, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.5);
      });
    } else {
      // Gentle descending scale
      const notes = [1046.50, 783.99, 659.25, 523.25, 392.00, 329.63, 261.63];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const delay = idx * 0.05;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.015, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.5);
      });
    }
  }

  public startAmbience() {
    this.initCtx();
    if (!this.ctx || this.isAmbiencePlaying) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(60, this.ctx.currentTime); // Low hum
    
    // Low frequency modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(2, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(120, this.ctx.currentTime); // Second harmonic

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(150, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5); // Smooth fade in

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc2.start();

    this.ambientNode = osc;
    this.ambientGain = gain;
    this.ambientFilter = filter;
    this.isAmbiencePlaying = true;
  }

  public stopAmbience() {
    if (!this.ctx || !this.isAmbiencePlaying) return;

    if (this.ambientGain) {
      const currentGain = this.ambientGain.gain.value;
      this.ambientGain.gain.setValueAtTime(currentGain, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0); // Smooth fade out
      
      const node = this.ambientNode;
      setTimeout(() => {
        try {
          node?.stop();
        } catch (e) {}
      }, 1100);
    }

    this.isAmbiencePlaying = false;
    this.ambientNode = null;
    this.ambientGain = null;
    this.ambientFilter = null;
  }

  public toggleAmbience() {
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }

  public getAmbientState() {
    return this.isAmbiencePlaying;
  }
}

export const soundSynth = new SoundSynth();

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    soundSynth.playClick();
    const state = soundSynth.toggleAmbience();
    setIsPlaying(state);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      <button
        id="audio-toggle-btn"
        onClick={handleToggle}
        onMouseEnter={() => soundSynth.playHover()}
        className={`relative flex h-12 items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 backdrop-blur-md cursor-pointer ${
          isPlaying
            ? "border-cyan-500 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.3)]"
            : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
        }`}
      >
        <span className="relative flex h-3 w-3">
          {isPlaying ? (
            <>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
            </>
          ) : (
            <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-500"></span>
          )}
        </span>
        <span className="font-sans">
          {isPlaying ? "إيقاف الموسيقى المحيطية" : "تشغيل المؤثرات الصوتية والمحيطية"}
        </span>
      </button>
    </div>
  );
}
