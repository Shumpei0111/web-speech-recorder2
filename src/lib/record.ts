import RecordRTC, { StereoAudioRecorder } from "recordrtc";

export let state: "recording" | "stopped" = "stopped";

export default class AudioRecordingModule {
  private stream?: MediaStream;
  private recorder?: RecordRTC;
  private mediaDevice?: MediaDevices;
  public async setAudioStream() {
    try {
      this.getStream();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private async getStream() {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }
    return this.stream;
  }

  public async recStart() {
    if (state == "recording") {
      this.recorder?.stopRecording();
    }

    if (this.recorder) {
      this.recorder.destroy();
    }

    const stream = await this.getStream();

    this.recorder = new RecordRTC(stream.clone(), {
      type: "audio",
      mimeType: "audio/wav",
      disableLogs: true,
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 2,
    });
    this.recorder.startRecording();
  }

  public async recStop() {
    // 録音が進行中でなければ何もしない
    if (!this.recorder || this.recorder.state !== "recording") {
      return;
    }

    // 録音を停止
    await this.recorder.stopRecording();

    // ストリームの各トラックを停止（クリーンアップ）
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = undefined;
    }

    // RecordRTC インスタンスを破棄
    this.recorder.destroy();
    this.recorder = undefined;
  }
}
