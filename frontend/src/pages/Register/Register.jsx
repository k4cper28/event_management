import { useForm } from "react-hook-form";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate, Navigate, Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import MainContainer from "@/components/MainContainer/MainContainer";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

function Register() {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm();

    const onSubmit = async (values) => {
        if (isValid) {
            
            fetch("http://localhost:8080/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    //passwordRepeated: values.passwordRepeated
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((err) => {
                            throw new Error(JSON.stringify(err));
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                    toast({
                        title: "Hurrah!",
                        description: "Successfully registered!",
                        className: "bg-green-800",
                    });

                    navigate("/login");
                })
                .catch((error) => {
                    
                    const errorMessage = JSON.parse(error.message);
                    console.log(errorMessage);

                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: errorMessage.message,
                    });
                });
        } else {
            console.log("NOT VALID");
        }
    };

    if (isAuthenticated) {
        // If authenticated user, then redirect to secure dashboard

        return <Navigate to={"/"} replace />;
    } else {
        return (
            <MainContainer>
                <div className="h-screen flex justify-center items-center">
                    <Card className="mx-auto max-w-sm">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
                                <CardDescription>
                                    Enter your information to create an account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">
                                                First name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Max"
                                                className={cn(errors.firstName ? "text-red-500 border-red-500" : "text-foreground", )}
                                                {...register("firstName", {
                                                    required: "First name is required",
                                                    pattern: {
                                                        value: /^[A-ZŁŚĆŻŹ][a-ząćęłńóśżź]+$/,
                                                        message: "First name is not validated",
                                                    },
                                                })}
                                            />
                                            <p className="text-red-500 text-xs">{errors.firstName && errors.firstName.message}</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">
                                                Last name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Robinson"
                                                className={cn(errors.lastName ? "text-red-500 border-red-500" : "text-foreground", )}
                                                {...register("lastName", {
                                                    required: "Last name is required",
                                                    pattern: {
                                                        value: /^[A-ZŁŚĆŻŹ][a-ząćęłńóśżź]+$/,
                                                        message: "Last name is not validated",
                                                    },
                                                })}
                                                
                                            />
                                            <p className="text-red-500 text-xs">{errors.lastName && errors.lastName.message}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            className={cn(errors.email ? "text-red-500 border-red-500" : "text-foreground", )}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                                                    message: "Email is not validated",
                                                },
                                            })}
                                        />
                                        <p className="text-red-500 text-xs">{errors.email && errors.email.message}</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input 
                                            id="password" 
                                            type="password"
                                            placeholder="********"
                                            className={cn(errors.password ? "text-red-500 border-red-500" : "text-foreground", )}
                                            // className="border invalid:border-pink-500 invalid:text-pink-600"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 8,
                                                    message:
                                                        "Password must have at least 8 characters",
                                                },
                                                maxLength: {
                                                    value: 32,
                                                    message:
                                                        "Password must have at most 32 characters",
                                                },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}/,
                                                    message: "Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number",
                                                },
                                            })}
                                        />
                                        <p className="text-red-500 h-fit text-xs">{errors.password && errors.password.message}</p>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Create an account
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link to="/login" className="underline">
                                        Sign in
                                    </Link>
                                </div>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            </MainContainer>
        );
    }
}

export default Register;