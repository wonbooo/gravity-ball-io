import { Howl } from 'howler';

class SoundManagerClass {
  private enabled = true;
  private volume = 0.5;
  private audioFilesExist = false;

  // 音效实例（延迟初始化）
  private sounds: {
    eat?: Howl;
    skill?: Howl;
    death?: Howl;
    bgm?: Howl;
  } = {};

  constructor() {
    // 音频功能暂时禁用，等待用户添加音频文件
    this.enabled = false;
    this.audioFilesExist = false;
  }

  playEat() {
    if (this.enabled && this.audioFilesExist && this.sounds.eat) {
      this.sounds.eat.play();
    }
  }

  playSkill() {
    if (this.enabled && this.audioFilesExist && this.sounds.skill) {
      this.sounds.skill.play();
    }
  }

  playDeath() {
    if (this.enabled && this.audioFilesExist && this.sounds.death) {
      this.sounds.death.play();
    }
  }

  playBGM() {
    if (this.enabled && this.audioFilesExist && this.sounds.bgm) {
      this.sounds.bgm.play();
    }
  }

  stopBGM() {
    if (this.audioFilesExist && this.sounds.bgm) {
      this.sounds.bgm.stop();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBGM();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      if (sound) {
        sound.volume(this.volume);
      }
    });
  }

  isEnabled(): boolean {
    return this.enabled && this.audioFilesExist;
  }

  // 检查音频功能是否可用
  isAudioAvailable(): boolean {
    return this.audioFilesExist;
  }
}

export const SoundManager = new SoundManagerClass();
