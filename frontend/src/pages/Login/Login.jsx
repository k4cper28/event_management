import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate, Link } from "react-router-dom";
import React from 'react';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainContainer from "@/components/MainContainer/MainContainer";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

function Login() {

    const isAuthenticated = useIsAuthenticated();
    const signIn = useSignIn();
    const navigate = useNavigate();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        // watch,
        // reset,
        formState: { errors, isValid },
    } = useForm();

    const onSubmit = async (values) => {
        console.log(values);
        fetch("http://localhost:8080/auth", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(JSON.stringify(err));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
    
            // Zaktualizuj logikę signIn, aby użyć zwróconego tokena
            signIn({
                auth: { token: data.data, type: 'Bearer' } // zakładając, że token jest zwracany jako 'data'
            });
    
            toast({
                title: "Hurrah!",
                description: "Successfully logged in!",
                className: "bg-green-800"
            })
    
            navigate("/");
        })
        .catch(error => {
            console.log(error);
            const errorMessage = JSON.parse(error.message);
    
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: errorMessage.message, // Zakładając, że odpowiedź zawiera klucz 'message'
            })
        });
    };
    

    if (isAuthenticated) {
        // If authenticated user, then redirect to secure dashboard

        return <Navigate to={"/"} replace />;
    } else {
        return (
            <MainContainer>
                <div className="h-screen flex justify-center items-center">
                    <Card className="max-w-full w-[400px]">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle className="scroll-m-20 text-xl font-bold tracking-tight">Login</CardTitle>
                                <CardDescription>Enter your details to log in!</CardDescription>
                            </CardHeader>
                            <CardContent>
                                
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="email" className={cn(errors.email ? "text-red-500" : "text-foreground")}>Email</Label>
                                            <Input 
                                                id="email"
                                                type="email"
                                                placeholder="example@gmail.com" 
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i,
                                                        message: "Email is not validated",
                                                    },
                                                })}
                                            />
                                            <p className="text-red-500 h-4 text-xs">{errors.email && errors.email.message}</p>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password" className={cn(errors.password ? "text-red-500" : "text-foreground")}>Password</Label>
                                            <Input 
                                                id="password" 
                                                type="password"
                                                placeholder="********"
                                                {...register("password", {
                                                    required: "Password is required",
                                                })}
                                            />
                                            <p className="text-red-500 h-6 text-xs">{errors.password && errors.password.message}</p>

                                        </div>

                                        {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                            Don’t have an account yet? <Link to="/register" className="font-medium text-primary hover:underline dark:text-primary">Sign up</Link>
                                        </p> */}
                                    </div>
                                    <Button className="w-full" type="submit" >Login</Button>
                                    <div className="mt-4 text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link to="/register" className="underline">
                                            Sign up
                                        </Link>
                                    </div>
                            </CardContent>
                            
                            {/* <CardFooter className="flex flex-col">
                                
                            </CardFooter> */}
                        </form>
                    </Card>
                </div>
            </MainContainer>
        );
    }
}

export default Login;
