import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface TransformResponse {
  data: Blob;
  filename: string;
}

export const fileApi = {
  /**
   * Check if the backend is healthy
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  /**
   * Transform/convert an image file
   * @param file - The file to transform
   * @param targetFormat - The target format (png, jpg, jpeg)
   */
  transformImage: async (
    file: File,
    targetFormat: string
  ): Promise<TransformResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/transform?to=${targetFormat}`,
      formData,
      {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = `converted.${targetFormat}`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    return {
      data: response.data,
      filename,
    };
  },
};
