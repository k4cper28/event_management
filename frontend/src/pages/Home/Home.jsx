import MainContainer from '@/components/MainContainer/MainContainer';
import React from 'react';
import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

function Home() {
    return (
        <MainContainer>

            <div className="mx-auto mt-16 mb-16">
    <Card>
        <CardHeader>
            <CardTitle>
                <div className='text-center text-6xl'>
                Evento
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='text-center'>
            <p>Welcome to EventEpicenter, your premier online destination for all things events! Whether you're planning a corporate conference,</p>
            <p>a wedding, or a community fundraiser, we've got you covered. Dive into our comprehensive catalog of venues, vendors, and services</p>
            <p> to bring your vision to life. With user-friendly tools for budgeting, scheduling, and guest management, orchestrating your next</p>
            <p>big event has never been easier. Join our vibrant community of event enthusiasts and make your occasions truly unforgettable.</p>
            <p>Let's create memories together, one event at a time!</p>
            </div>
        </CardContent>
    </Card>
</div>

        </MainContainer>
    )
}

export default Home;