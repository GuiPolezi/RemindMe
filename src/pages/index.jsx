import { useState } from 'react'
import { Logout } from '../components/Logout'
import { AddLembrete, GetLembrete, GetCalendarLembretes } from '../components/Lembrete'

export function Home() {
    return (
        <>
            <section className='header p-5'>
                <div className="grid grid-cols-2">
                    <div className="col-span-1 bg-gray-500">
                        <h1 className='text-7xl font-bold'>RemindME</h1>
                    </div>
                    <div className="col-span-1 text-end self-center">
                        <p className='text-3xl font-bold'>MENU</p>
                    </div>
                </div>
            </section>
            <Logout />
            <AddLembrete />
            {/*
            <GetLembrete idLembrete={1}/>
            */}
            <GetCalendarLembretes />

        </>
    )
}