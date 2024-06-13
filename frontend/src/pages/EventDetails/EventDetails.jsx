import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import MainContainer from '@/components/MainContainer/MainContainer';
import { useToast } from "@/components/ui/use-toast";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketsToBuy, setTicketsToBuy] = useState(0);
    const authHeader = useAuthHeader();
    const token = authHeader.split(' ')[1];

    const { toast } = useToast();


    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/event/event-by-id/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error.message);
                toast.error('Ups! Coś poszło nie tak.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, token]);

    const handleBuyTickets = async () => {
        if (ticketsToBuy <= 0 || ticketsToBuy > event.availableTickets) {
            toast.error('Proszę wprowadzić poprawną liczbę biletów.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/event/buy/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({ tickets: ticketsToBuy }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
    
            // Pobierz zaktualizowane szczegóły wydarzenia
            const updatedEvent = await fetch(`http://localhost:8080/event/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });
    
            if (!updatedEvent.ok) {
                const errorText = await updatedEvent.text();
                throw new Error(errorText);
            }
    
            const eventData = await updatedEvent.json();
            setEvent(eventData); // Ustaw zaktualizowane szczegóły wydarzenia
            toast({
                variant: "success",
                title: "Tickets purchased successfully"
            });
            
        } catch (error) {
            console.error('Błąd podczas zakupu biletów:', error.message);
            toast({
                variant: "error",
                title: "Oops! Something went wrong."
            });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!event) {
        return <p>No event found.</p>;
    }

    return (
        <MainContainer>
            <Card className="mx-auto mt-16 mb-16">
                <CardHeader>
                    <CardTitle className="text-center">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center w-[400px]">
                    <p>{event.description}</p>
                    <p className='mt-8'>Date: {new Date(event.date).toLocaleString()}</p>
                    <p className='mt-8'>Tickets available: {event.availableTickets}</p>
                    <p className='mt-8'>Price: {event.price}$</p>
                    <div className='mt-8'>
                        <Input
                            id="quantity"
                            type="number"
                            value={ticketsToBuy}
                            onChange={(e) => setTicketsToBuy(parseInt(e.target.value))}
                            min="0"
                            max={event.availableTickets}
                            placeholder="0"
                        />
                    </div>
                    <Button className="mt-8" onClick={handleBuyTickets}>Kup</Button>
                </CardContent>
            </Card>
        </MainContainer>
    );
}

export default EventDetails;
