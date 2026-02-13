declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    live: {
      connect(options: any): Promise<any>;
    };
    models: {
      generateContent(options: any): Promise<any>;
    };
    chats: {
        create(options: any): any;
    };
  }

  export enum Modality {
    AUDIO = 'AUDIO',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE'
  }

  export interface LiveServerMessage {
    serverContent?: {
      modelTurn?: {
        parts: { inlineData: { data: string; mimeType: string } }[];
      };
      interrupted?: boolean;
      turnComplete?: boolean;
    };
    toolCall?: any;
  }
  
  export type Blob = {
    data: string;
    mimeType: string;
  }
  
  export interface FunctionDeclaration {
      name: string;
      description?: string;
      parameters?: any;
  }
}