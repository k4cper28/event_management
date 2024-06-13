import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@/components/MainContainer/MainContainer';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import DatePicker from 'react-datepicker';
import {
    CalendarIcon
} from "@radix-ui/react-icons";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Title } from '@radix-ui/react-dialog';

function EditEvent() {
    const authHeader = useAuthHeader();
    const token = authHeader.split(' ')[1];
    const isAuthenticated = useIsAuthenticated();
    const signIn = useSignIn();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { id } = useParams();

    const modifyDate = (date, hours, minutes) => {
        const modifiedDate = new Date(date);
        modifiedDate.setHours(hours);
        modifiedDate.setMinutes(minutes);
        return modifiedDate;
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [titleOrg, setTitleOrg] = useState();
    const [descriptionOrg, setDescriptionOrg] = useState();

    const { register, handleSubmit, control, setValue, formState: { errors, isValid } } = useForm();

    useEffect(() => {
        // Fetch the event data when the component mounts
        fetch(`http://localhost:8080/event/event-by-id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": token,
            }
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
            // Populate form fields with the fetched data
            setValue('title', data.title);
            // useState(titleOrg, data.title);
            setValue('description', data.description);
            // useState(descriptionOrg, data.description);
            setValue('Date', new Date(data.date));
            setSelectedDate(new Date(data.date));
            setValue('location', data.location);
            setValue('totalTickets', data.totalTickets);
            setValue('price', data.price);
        })
        .catch(error => {
            console.log(error);
            const errorMessage = JSON.parse(error.message);

            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: errorMessage.error,
            });
        });
    }, [id, setValue, token, toast]);

    const onSubmit = async (values) => {
        console.log(values);

        if (isValid) {
            fetch(`http://localhost:8080/event/edit/${id}`, {
                method: 'PATCH',
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
                    price: values.price,
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
                });

                navigate("/");
            })
            .catch(error => {
                console.log(error);
                const errorMessage = JSON.parse(error.message);

                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: errorMessage.error,
                });
            });

        }
    };

    return (
        <MainContainer>
            <Card className='mt-16 mb-16'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className='text-center text-4xl'>
                            Edit your event
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="title" className={cn(errors.title ? "text-red-500" : "text-foreground")}>Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    // value= {titleOrg}
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
                                    })}
                                />
                                <p className="text-red-500 h-4 text-xs">{errors.title && errors.title.message}</p>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description" className={cn(errors.description ? "text-red-500" : "text-foreground")}>Description</Label>
                                <Textarea
                                    id="description"
                                    type="text"
                                    // value={descriptionOrg}
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
                                    rules={{ required: "Date is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"}>
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
                                    })}
                                />
                                <p className="text-red-500 h-4 text-xs">{errors.location && errors.location.message}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="totalTickets">Total Tickets</Label>
                                    <Input
                                        id="totalTickets"
                                        placeholder="0"
                                        className={cn(errors.totalTickets ? "text-red-500 border-red-500" : "text-foreground")}
                                        {...register("totalTickets", {
                                            required: "Total Tickets is required",
                                            min: {
                                                value: 0,
                                                message: "Total Tickets must be a positive number",
                                            }
                                        })}
                                    />
                                    <p className="text-red-500 text-xs">{errors.totalTickets && errors.totalTickets.message}</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        placeholder="150"
                                        className={cn(errors.price ? "text-red-500 border-red-500" : "text-foreground")}
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
                        <Button className="w-full mt-8" type="submit">Edit event</Button>
                    </CardContent>
                </form>
            </Card>
        </MainContainer>
    );
}

export default EditEvent;
