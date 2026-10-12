import toast from "react-hot-toast"

const notify=(type,message)=>{
    toast[type](message,{
        style:{direction:'rtl'},
        duration:3000,
        position:'top-center'
    })
}
export default notify