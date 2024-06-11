import MainContainer from '@/components/MainContainer/MainContainer';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useState, useEffect } from "react";

import {
    CalendarIcon
} from "@radix-ui/react-icons";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


function CreateEvent() {

    const authHeader = useAuthHeader();
    const token = authHeader.split(' ')[1];
    const isAuthenticated = useIsAuthenticated();
    const signIn = useSignIn();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm();

    const onSubmit = async (values) => {
        console.log(values);
        
        if (isValid) {
            fetch("http://localhost:8080/event", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-access-token": token,
                },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    date: values.Date,
                    location: values.location,
                    totalTickets: values.totalTickets,
                    availableTickets: values.totalTickets,
                    price: values.price
                }),
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

                toast({
                    title: "Hurrah!",
                    description: "Successfully created!",
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
                    description: errorMessage.error,
                })
            });

        } else {
            alert("INVALID");
        }

    };

    return (
        <MainContainer>
            <Card  className='mt-16 mb-16'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className='text-center text-4xl'>
                            Add your event
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title" className={cn(errors.title ? "text-red-500" : "text-foreground")}>Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Taylor Swift Concert"
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 1,
                                            message: "Title must be at least 1 character long",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Title must be at most 100 characters long",
                                        },
                                        })
                                    }
                                />
                        <p className="text-red-500 h-4 text-xs">{errors.title && errors.title.message}</p>
                        </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description" className={cn(errors.description ? "text-red-500" : "text-foreground")}>Description</Label>
                                    <Textarea 
                                        id="description"
                                            type="text"
                                            placeholder="This is an invoice for..." 
                                            {...register("description", {
                                                required: "Description is required",
                                            })}
                                    />
                                <p className="text-red-500 h-4 text-xs">{errors.description && errors.description.message}</p>
                            </div>

                              <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="Date" className={cn(errors.Date ? "text-red-500" : "text-foreground")}>Date</Label>
                            <Controller
                                control={control}
                                name='Date'
                                rules={{ required: "Due date is required" }}
                                render={({ field: { onChange, value } }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                            >
                                                {value ? value.toLocaleDateString() : "Select date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={value} 
                                                onSelect={(date) => {
                                                    setSelectedDate(date);
                                                    onChange(date);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            <p className="text-red-500 h-4 text-xs">{errors.Date && errors.Date.message}</p>
                        </div>          
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="location" className={cn(errors.location ? "text-red-500" : "text-foreground")}>Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Narodowy, Warszawa"
                                    {...register("location", {
                                        required: "Location is required",
                                        minLength: {
                                            value: 1,
                                            message: "Location must be at least 1 character long",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: "Location must be at most 100 characters long",
                                        },
                                        })
                                    }
                                />
                        <p className="text-red-500 h-4 text-xs">{errors.location && errors.location.message}</p>
                        </div>    
                        <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="totalTickets">
                                                Total Tickets
                                            </Label>
                                            <Input
                                                id="totalTickets"
                                                placeholder="0"
                                                className={cn(errors.firstName ? "text-red-500 border-red-500" : "text-foreground", )}
                                                {...register("totalTickets", {
                                                    required: "Total Tickets name is required",
                                                    min: {
                                                        value: 0,
                                                        message: "Price must be a positive number",
                                                    }
                                                })}
                                            />
                                            <p className="text-red-500 text-xs">{errors.totalTickets && errors.totalTickets.message}</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                placeholder="150"
                                                className={cn(errors.price ? "text-red-500 border-red-500" : "text-foreground", )}
                                                {...register("price", {
                                                    required: "Price is required",
                                                    min: {
                                                        value: 0,
                                                        message: "Price must be a positive number",
                                                    }
                                                    
                                                })}
                                                
                                            />
                                            <p className="text-red-500 text-xs">{errors.price && errors.price.message}</p>
                                        </div>
                                    </div>
                            </div>
                            <Button className="w-full mt-8" type="submit" >Add event</Button>
                    </CardContent>
                </form>
            </Card>
        </MainContainer>
    )
}

export default CreateEvent;