import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { ref as storageRef } from 'firebase/storage'

export const useFireBaseStorage = () => {
  const storage = useFirebaseStorage()

  const prepareUploadFile = (imagePath: string) => {
    const mountainFileRef = storageRef(storage, imagePath)

    const {
      url,
      uploadProgress,
      uploadError,
      uploadTask,
      upload
    } = useStorageFile(mountainFileRef)

    return {
      url,
      uploadProgress,
      uploadError,
      uploadTask,
      upload
    }
  }

  return {
    prepareUploadFile
  }
}
