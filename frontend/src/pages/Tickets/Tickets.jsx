import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainContainer from '@/components/MainContainer/MainContainer';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { toast } from 'react-toastify';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';

function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
  
    // Dodanie zera przed liczbami jednocyfrowymi
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;
  }

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authHeader = useAuthHeader();
    const token = authHeader.split(' ')[1];
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
    
        try {
            const response = await fetch(`http://localhost:8080/ticket`, {
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
    
            // Pobierz dane o wydarzeniach na podstawie identyfikatorów wydarzeń z biletów
            const eventDataPromises = data.map(async (ticket) => {
                const eventResponse = await fetch(`http://localhost:8080/event/${ticket.eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                    },
                });
    
                if (!eventResponse.ok) {
                    throw new Error('Failed to fetch event data');
                }
    
                const eventData = await eventResponse.json();
    
                // Zapisz dane o wydarzeniu w polu `event` biletu
                ticket.event = eventData;
    
                return ticket;
            });
    
            const updatedTickets = await Promise.all(eventDataPromises);
    
            // Po pobraniu danych o wydarzeniach zaktualizuj stan komponentu
            setTickets(updatedTickets);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error.message);
            toast.error('Ups! Coś poszło nie tak.');
        } finally {
            setLoading(false);
        }
    };


    const handleReturnTicket = async (ticketId, eventId, tickets) => {
        try {
            // Usuń bilet
            await axios.delete(`http://localhost:8080/ticket/${ticketId}`);
            
            // Zwiększ liczbę dostępnych biletów dla wydarzenia
            await axios.put(`http://localhost:8080/event/return/${eventId}/${tickets}`);
    
            // Odśwież listę biletów
            fetchTickets();
            
            // Zaktualizuj stan komponentu lub wykonaj inne niezbędne akcje
        } catch (error) {
            console.error('Błąd podczas usuwania biletu:', error.message);
            toast.error('Ups! Coś poszło nie tak.');
        }
    };

    return (
        <MainContainer>
        
        <p className='mt-16 text-4xl font-bold'> Ticket List</p>
            <Card className='mt-16'>
                
                <CardContent>
            <Table>
                    <TableCaption>ticket list</TableCaption>
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-center w-[300px]">Title</TableCell>
                                <TableCell className="text-center w-[200px]">Date</TableCell>
                                <TableCell className="text-center w-[150px]">Location</TableCell>
                                <TableCell className="text-center w-[150px]">number of tickets</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <>
                                    
                                </>
                            ) : (
                                
                                tickets.map((ticket, index) => (
                                    <TableRow key={`${ticket._id}-${index}`}>
                                        <TableRow>
                                            <TableCell className='w-[300px] text-center'>{ticket.event && ticket.event.title}</TableCell>
                                            <TableCell className='w-[200px] text-center'>{ticket.event && formatDate(ticket.event.date)}</TableCell>
                                            <TableCell className='w-[150px] text-center'>{ticket.event && ticket.event.location}</TableCell>
                                            <TableCell className='w-[150px] text-center'>{ticket.event && ticket.tickets}</TableCell>
                                            <TableCell>
                                            <Button onClick={() => handleReturnTicket(ticket._id, ticket.eventId, ticket.tickets)}>Return</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableRow>
                                ))

                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </MainContainer>
    );  
}

export default Ticket;
