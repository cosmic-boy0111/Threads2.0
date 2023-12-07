import { X } from 'lucide-react'
import React from 'react'

const ThreadFilesViewer = (
    { Files , action } : 
    { 
        Files : {
            url : string,
            type : string
        }[], 
        action? : (index : number) => void 
    }
) => {
    return (
        <div className=" w-full relative">
            <div className=" w-full overflow-x-auto custom-scrollbar whitespace-nowrap py-1">

                {Files.length !== 0 &&
                    Files.map((file, index) => (
                        <div className=" relative h-auto inline-block mr-2">
                            {
                                file.type.includes('image') ?
                                    <img className={`object-cover sm:w-auto ${ Files.length === 1 ? 'md:w-auto md:h-96' : 'md:w-auto'}  ${Files.length === 1 ? 'h-auto' : ' h-44 sm:h-44 xs:h-44 md:h-64 xl:h-64'} rounded-md `} src={file.url} alt="..." /> :
                                    <video className={`object-cover w-auto  ${Files.length === 1 ? 'h-auto' : 'h-44 sm:h-44 xs:h-44 md:h-64 xl:h-64'} rounded-md `} playsInline={true} preload='auto' autoPlay={true} loop={true} muted={true}>
                                        <source src={file.url} />
                                    </video>
                            }
                            {action && 
                                <span className=" absolute text-light-3 cursor-pointer top-1 right-1 p-1 rounded-full bg-light-1 bg-opacity-50"
                                onClick={() => action(index)}
                                ><X size={15} /></span>
                            }
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ThreadFilesViewer