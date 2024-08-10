export type ShareStats = {
  bitrate: number;
  rtt: number;
  network: string;
  codec: string;
  jitter: number;
  limitation: unknown;
  totalPackets: number;
  packetsLost: number;
  concealmentEvents: number;
  insertedSamplesForDecelaration: number;
  removedSamplesForAccelaration: number;
  size: unknown;
  currentSpatialLayer: number;
  currentTemporalLayer: number;
  preferredSpatialLayer: number;
  preferredTemporalLayer: number;
};

export type VideoStats = {
  bitrate: number;
  rtt: number;
  network: string;
  codec: string;
  jitter: number;
  limitation: unknown;
  totalPackets: number;
  packetsLost: number;
  concealmentEvents: number;
  insertedSamplesForDecelaration: number;
  removedSamplesForAccelaration: number;
  size: unknown;
  currentSpatialLayer: number;
  currentTemporalLayer: number;
  preferredSpatialLayer: number;
  preferredTemporalLayer: number;
};

export type AudioStats = {
  bitrate: number;
  rtt: number;
  network: string;
  codec: string;
  jitter: number;
  limitation: unknown;
  totalPackets: number;
  packetsLost: number;
  concealmentEvents: number;
  insertedSamplesForDecelaration: number;
  removedSamplesForAccelaration: number;
  currentSpatialLayer?: number;
  currentTemporalLayer?: number;
  preferredSpatialLayer?: number;
  preferredTemporalLayer?: number;
  size: unknown;
};
