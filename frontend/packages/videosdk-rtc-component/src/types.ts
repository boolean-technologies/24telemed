export type ShareStats = {
    bitrate: number;
    rtt: number;
    network: string;
    codec: string;
    jitter: number;
    limitation: any;
    totalPackets: number;
    packetsLost: number;
    concealmentEvents: number;
    insertedSamplesForDecelaration: number;
    removedSamplesForAccelaration: number;
    size: any;
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
    limitation: any;
    totalPackets: number;
    packetsLost: number;
    concealmentEvents: number;
    insertedSamplesForDecelaration: number;
    removedSamplesForAccelaration: number;
    size: any;
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
        limitation: any;
        totalPackets: number;
        packetsLost: number;
        concealmentEvents: number;
        insertedSamplesForDecelaration: number;
        removedSamplesForAccelaration: number;
        size: any;
      }