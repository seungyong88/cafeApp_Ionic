import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Storage } from '@capacitor/storage'

export function usePhotoGallery() {

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  };

  return {
    takePhoto
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
