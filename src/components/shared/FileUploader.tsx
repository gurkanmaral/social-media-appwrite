import React, {useCallback,useState} from 'react'
import { useDropzone,FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (FILES : File[]) => void;
    mediaUrl:string;
    setFileType:any;
    fileType:any;
    fileUploaderType:any;
}

const FileUploader = ({fieldChange,mediaUrl,setFileType,fileType,fileUploaderType}:FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl,setFileUrl] = useState(mediaUrl)
    

    const onDrop = useCallback((acceptedFiles:FileWithPath[]) =>{

      if (acceptedFiles[0] && acceptedFiles[0].size > 5 * 1024 * 1024) {
        alert("You can't add videos greater than 5MB."); // Display an alert message
        return;
      }
      if(fileUploaderType === "user" && acceptedFiles[0].type === "video/mp4" ){
        alert("you cant add video to profile pic"); // Display an alert message
        return;
      }
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
        setFileType(acceptedFiles[0].type); // Set the file type
    },[file])

    const {getRootProps,getInputProps} = useDropzone({
        onDrop,
        accept:{
            'image/*':['.png','.jpeg','.jpg', '.svg'],
            'video/*':['.mp4']
        }})
        
        console.log(mediaUrl)
        
  return (
    <div {...getRootProps()} className="flex felx-center flex-col bg-dark-3 rounded-xl cursor-pointer">
    <input {...getInputProps()} className="cursor-pointer" />
    {fileUrl ? (
      // Display the image if mediaUrl is provided
      <>
        <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
        {fileType?.startsWith('video') ? (
              <video controls width="400">
                <source src={fileUrl} type={fileType} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={fileUrl} alt="image" className="file_uploader-img" />
            )}
        </div>
        <p className="file_uploader-label">Click or drag photo to replace</p>
      </>
    ) : (
      // Render the FileUploader component if mediaUrl is not provided
      <div className="file_uploader-box">
        <img src="/assets/icons/file-upload.svg" alt="" width={96} height={77} />
        <h3 className="base-medium text-light-2 mb-2 mt-6">Drag photo here</h3>
        <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
        <Button className="shad-button_dark_4">Select from computer</Button>
      </div>
    )}
  </div>
  )
}

export default FileUploader