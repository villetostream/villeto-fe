import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import AddNewReport from "./AddNewReport";
import useModal from "@/hooks/useModal";
import FlightBooking from "./reservations/FlightReservations";
import { PenLine, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewExpenseButtonTrigger = () => {
    const { open, close, toggle, isOpen } = useModal()
    const { open: openReservation, toggle: toggleReservation, isOpen: isOpenReservation } = useModal()
    return (
        <div>
            <AddNewReport isOpen={isOpen} close={close} toggle={toggle} />
            <FlightBooking isOpen={isOpenReservation} toggle={toggleReservation} open={openReservation} />
            <DropdownMenu >
                <DropdownMenuTrigger>

                    <Button size="lg">
                        New Report
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={toggle} >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Start New Report

                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleReservation}>
                        <PlusCircle />
                        Start New Reservation
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu></div>
    )
}

export default NewExpenseButtonTrigger