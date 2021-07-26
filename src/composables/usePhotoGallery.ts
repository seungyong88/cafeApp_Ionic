import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, FilesystemDirectory } from '@capacitor/filesystem'
import { Storage } from '@capacitor/storage'
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

import { actionSheetController } from "@ionic/vue";
import { trash, close } from 'ionicons/icons';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const PHOTO_STORAGE = "photos";
  const photos = ref<UserPhoto[]>([]);

  const loadSaved = async () => {
    const photoList = await Storage.get({key: PHOTO_STORAGE});
    const photoInStorage = photoList.value ? JSON.parse(photoList.value) : [];

    if(!isPlatform('hybrid')) {
      for(const photo of photoInStorage){
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        })

        photo.webviewPath = `data:image/jpeg;base64, ${file.data}`;
      }
    }

    photos.value = photoInStorage;
  }
  onMounted(loadSaved);

  
  const deletePhoto = async (photo: UserPhoto) => {
    photos.value = photos.value.filter(p => p.filepath !== photo.filepath);

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    })
  }

  const showActionSheet = async (photo: UserPhoto) => {
    const actionSheet = await actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: trash,
        handler: () => {
          deletePhoto(photo);
        }}, {
          text: 'Cancel',
          icon: close,
          role: 'cancel',
          handler: () => { // do nothing when cancel is clicked }
        }
      }]
    })

    await actionSheet.present();
  }

  const cachePhotos = () => {
    Storage.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value)
    });
  }

  watch(photos, cachePhotos);

  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;
  
    // "hybrid" will detect if we are 
    if(isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      base64Data  = file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = await convertBlobToBase64(blob) as string;
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    
    // https://www.youtube.com/watch?v=3Cy5W_fpQSA
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    
    if(isPlatform('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      }
    }else{
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    photos.value = [savedFileImage, ...photos.value];
  };

  return {
    photos,
    takePhoto,
    deletePhoto,
    showActionSheet
  };
}
