import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AddNewReport from "./AddNewReport";
import useModal from "@/hooks/useModal";
import FlightBooking from "./reservations/FlightReservations";
import { PenLine, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

const NewExpenseButtonTrigger = () => {
  const { open, close, toggle, isOpen } = useModal();
  const {
    open: openReservation,
    toggle: toggleReservation,
    isOpen: isOpenReservation,
  } = useModal();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check for openAddReport query param and open modal
  useEffect(() => {
    if (searchParams.get("openAddReport") === "true") {
      open();
      // Remove openAddReport param but keep tab param
      const params = new URLSearchParams(searchParams.toString());
      params.delete("openAddReport");
      const tabParam = searchParams.get("tab");
      const newUrl = tabParam 
        ? `/expenses?tab=${tabParam}${params.toString() ? `&${params.toString()}` : ''}`
        : `/expenses${params.toString() ? `?${params.toString()}` : ''}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, open, router]);

  return (
    <div>
      <AddNewReport isOpen={isOpen} close={close} toggle={toggle} />
      <FlightBooking
        isOpen={isOpenReservation}
        toggle={toggleReservation}
        open={openReservation}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="lg">New Report</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onClick={toggle}
            className="bg-primary hover:bg-primary/80!"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Start New Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleReservation}>
            <PlusCircle />
            Start New Reservation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NewExpenseButtonTrigger;
