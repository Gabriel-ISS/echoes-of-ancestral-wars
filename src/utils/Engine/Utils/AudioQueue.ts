export default class AudioQueue {
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

  public start(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.audio.play();
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.audio.pause();
      this.audio.currentTime = 0; // Reinicia el audio
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
