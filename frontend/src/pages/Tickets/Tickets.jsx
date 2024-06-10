import React, { useState, useEffect } from 'react';
import MainContainer from '@/components/MainContainer/MainContainer';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { toast } from 'react-toastify';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';
// import moment from 'moment';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
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
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const authHeader = useAuthHeader();
    const token = authHeader.split(' ')[1];


    useEffect(() => {
        fetchEvents();
    }, [currentPage]);

    const fetchEvents = async () => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/event`, {
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
            console.log('Dane pobrane:', data);
            setEvents(data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error.message);
            toast.error('Ups! Coś poszło nie tak.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <MainContainer>
            <Card className='mt-16'>
                
                <CardContent>
                    <Table>
                        <TableCaption>Lista wydarzeń</TableCaption>
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-center w-[200px]">Title</TableCell>
                                <TableCell className="text-center w-[300px]">Description</TableCell>
                                <TableCell className="text-center w-[200px]">Date</TableCell>
                                <TableCell className="text-center w-[150px]">Location</TableCell>
                                <TableCell className="text-center w-[135px]">Tickets available</TableCell>
                                <TableCell className="text-center w-[135px]">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <>
                                    
                                </>
                            ) : (
                                events.map(event => (
                                    <TableRow  key={event._id}>
                                        <TableRow>
                                            <TableCell className='w-[200px] text-center'>{event.title}</TableCell>
                                            <TableCell className='w-[300px] text-center text-wrap'>{event.description}</TableCell>
                                            <TableCell  className='w-[200px] text-center'>{formatDate(event.date)}</TableCell>
                                            <TableCell className='w-[150px] text-center'>{event.location}</TableCell>
                                            <TableCell className='w-[150px] text-center'>{event.availableTickets  + "/" + event.totalTickets}</TableCell>
                                            <TableCell className='w-[150px] text-center'>{event.price + "$"}</TableCell>
                                            <TableCell>
                                                <Button>
                                                    <Link to={`/event/${event._id}`}>preview</Link>
                                                </Button>
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
