"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Progress from "@/ComponentsProgress"
import { useRouter } from 'next/navigation'
import axios from 'axios'

const userImg = "/images/user.png" 

const UserForm = () => {

    const router = useRouter()
    const API = "http://localhost:1998/GMND/api"
    const [isLoading, setIsLoading] = useState(true)

    const [state, setState] = useState({
        headerName:"LOGIN",
        isVisible:true,
        linkName:"REGISTER",
    })

    const [formData, setFormData] = useState({
        username:"",
        email:"",
        password:""
    })

    function handleChange(name){
        
        if(name === "REGISTER"){
            setState({
                headerName: "REGISTER",
                isVisible: false,
                linkName: "LOGIN"
            })
        }else{
            setState({
                headerName: "LOGIN",
                isVisible: true,
                linkName: "REGISTER"
            })
        }

        setFormData({
            userName: "",
            email: "",
            password: ""
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(formData);

        const { username, email, password} = formData;
            
        if (state.headerName === "LOGIN") {
            if (formData.email !== "" || formData.password !== "") {
                setIsLoading(false);
                axios.post(`${API}/users/login`, formData)
                    .then((response) => {
                        console.log(response);
                        alert(response.data.message)
                        localStorage.setItem("token",response.data.token)
                        localStorage.setItem("user",response.data.data.username)
                        const userid = response.data.data._id
                        setIsLoading(true);
                        if (response.status === 200) {
                            router.push(`/records/${userid}`);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                alert("Please fill all the fields");
            }
        } else if (username !=="" || email !== "" || password !== "") {
            setIsLoading(false);
            // http://localhost:1998/GMND/api/users/
            axios.post(`${API}/users/`, formData)
                .then((response) => {
                    console.log(response);
                    alert(response.data.message)
                    setIsLoading(true);
                    if (response.data.status === 201) {
                        setState({
                            headerName: "LOGIN",
                            isVisible: true,
                            linkName: "REGISTER"
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
            
            
        setFormData({
            username: "",
            email: "",
            password: ""
        })
    }
    return (
        <div className="w-72 p-6 bg-sky-100 rounded-lg">
            <section className="flex flex-col items-center gap-y-6">
                    <h3 className="text-2xl font-bold text-sky-800">{state.headerName}</h3>
                
                    <Image src={userImg} alt="user" width={100} height={100 } className="rounded-full bg-slate-50" hidden={state.isVisible}/>

                    <div className="flex flex-col items-center gap-y-5">
                        <form className="flex flex-col items-center gap-y-2">
                            <input type="text" className="bg-slate-100 h-8 rounded-2xl pl-3" placeholder="USERNAME" onChange={(e)=>setFormData((prevState)=>({...prevState,username:e.target.value}))} value={formData.username} hidden={state.isVisible}/>
                            <input type="text" className="bg-slate-100 h-8 rounded-2xl pl-3" placeholder="EMAIL" onChange={(e)=>setFormData((prevState)=>({...prevState,email:e.target.value}))} value={formData.email}/>
                            <div className="w-full flex justify-end"><span className="text-xs cursor-pointer text-sky-600 font-bold" hidden={!state.isVisible}>Forget password ?</span></div>
                            <input type="text" className="bg-slate-100 h-8 rounded-2xl pl-3" placeholder="PASSWORD" onChange={(e)=>setFormData((prevState)=>({...prevState,password:e.target.value}))} value={formData.password}/>
                        </form>

                        <button className="bg-lime-300 px-6 py-1 cursor-pointer hover:bg-sky-500 hover:text-slate-50 rounded-2xl" onClick={(e)=>handleSubmit(e)}>
                            {state.headerName}
                        </button>
                    </div>
                
                    <span className="text-xs">Already i have an account ? <span className="font-bold hover:text-sky-500 cursor-pointer" onClick={()=>handleChange(state.linkName)}>{state.linkName}</span></span>
            </section>
            <Progress progressHidden={isLoading} />
        </div>
    )
}

export default UserForm
