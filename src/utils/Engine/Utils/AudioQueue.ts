export default class AudioQueue {
  static defaultVolume = 0.5;
  private audio: HTMLAudioElement;
  private queue: string[];
  private currentIndex: number;
  private isPlaying: boolean;

  constructor(basePath: string, queueLength: number) {
    this.queue = this.generateQueue(basePath, queueLength);
    this.currentIndex = 0;
    this.isPlaying = false;
    this.audio = new Audio(this.queue[this.currentIndex]);

    this.audio.addEventListener("ended", () => this.playNext());
  }

  private generateQueue(basePath: string, queueLength: number): string[] {
    const queue: string[] = [];
    for (let i = 0; i < queueLength; i++) {
      queue.push(`${basePath}/${i}.mp3`); 
    }
    return queue;
  }

  public play(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.audio.play();
      this.audio.volume = AudioQueue.defaultVolume;
    }
  }

  public pause(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.audio.pause();
    }
  }

  private playNext(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.queue.length) {
      this.currentIndex = 0; // Reinicia el índice si se llega al final
    }
    this.audio.src = this.queue[this.currentIndex];
    this.audio.play();
  }
}
