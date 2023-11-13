import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { toast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { UserValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations"

type UpdateUserProps = {
  user?: Models.Document
}

const UpdateUser = ({user}:UpdateUserProps) => {
    
  const {mutateAsync: updateUser,isPending:isLoadingUpdate} = useUpdateUser();
const navigate = useNavigate()
    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
          name: user ? user?.name : "",
          bio: user ? user?.bio : "",
          profilePictures: [], 
          backgroundPictures: [],    
        },
      })


    async function onSubmit(values: z.infer<typeof UserValidation>) {
       
      const updatedUser = await updateUser({
        ...values,
        userId:user.$id,
        imageId:user?.imageId,
        imageUrl:user?.imageUrl,
        bgImageId:user?.bgImageId,
        bgImageUrl:user?.bgImageUrl,
      })
      if(!updatedUser) {
        toast({title:'Please try again'})
      }
      return navigate(`/profile/${user?.$id}`)
       }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Name</FormLabel>
            <FormControl>
              <Textarea 
              className="shad-textarea custom-scrollbar" 
              placeholder="" 
              {...field}            
              />          
            </FormControl>        
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Bio</FormLabel>
            <FormControl>
              <Textarea 
              className="shad-textarea custom-scrollbar" 
              placeholder="" 
              {...field}            
              />          
            </FormControl>        
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="profilePictures"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Photos</FormLabel>
            <FormControl>
              <FileUploader
              fieldChange={field.onChange}
              mediaUrl={user?.imageUrl}
              fileUploaderType="user"
              />
            </FormControl>        
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="backgroundPictures"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Background Image</FormLabel>
            <FormControl>
              <FileUploader
              fieldChange={field.onChange}
              mediaUrl={user?.bgImageUrl}
              />
            </FormControl>        
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
       
      <div className="flex gap-4 items-center justify-end">
      <Button type="button"
       className="shad-button_dark_4">
        Cancel
      </Button>
      <Button type="submit" 
      className="shad-button_primary whitespace-nowrap"
      
      >
      
       {isLoadingUpdate && 'Loading...'}
       Update
      </Button>
      </div>
      
    </form>
  </Form>
  )
}

export default UpdateUser