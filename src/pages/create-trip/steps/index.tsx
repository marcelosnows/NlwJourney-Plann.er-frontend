import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./destination-and-date-step";
import { InvitesGuestsStep } from "./invites_guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../../lib/axios";

export function CreateTripPage() {

  const navigate = useNavigate();

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [destination, setDestination] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [eventStartEndDates, setEventStartEndDates] = useState<DateRange | undefined>();


  const [emailsToInvite, setEmailsToInvite] = useState ([
    "diego@rocketset.com.br",
    "marcsneves@hotmail.com"
  ]);

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  };

  function closeGuestInput() {
    setIsGuestsInputOpen(false);
  };

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  };

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  };

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  };

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  };

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if(!email) {
      return
    };

    if (emailsToInvite.includes(email)) {
      return
    };

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ]);

    event.currentTarget.reset();
  };

  function removeEmailToInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove);

    setEmailsToInvite(newEmailList);
  };

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(destination);
    console.log(eventStartEndDates);
    console.log(emailsToInvite);
    console.log(ownerName);
    console.log(ownerEmail);

    if (!destination) {
      return
    }

    if (!eventStartEndDates?.from || !eventStartEndDates?.to) {
      return
    }
    
    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }


    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartEndDates.from,
      ends_at: eventStartEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    });

    const { tripId } = response.data; 

    navigate(`/trips/${tripId}`);
  };
   
  return (
  <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div className="max-w-3xl w-full px-6 text-center space-y-10">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.svg" alt="plann.er" />
        <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
      </div>

        <div className="space-y-4">
          <DestinationAndDateStep 
            closeGuestInput={closeGuestInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            eventStartEndDates={eventStartEndDates}
            setEventStartEndDates={setEventStartEndDates}
          />

          {isGuestsInputOpen && (
            <InvitesGuestsStep 
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
              emailsToInvite={emailsToInvite}
            />
        )}
      </div>

      <p className="text-sm text-zinc-500">
        Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
        com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
      </p>
    </div>
    
    {/* Modal de participantes */}

    {isGuestsModalOpen && (
      <InviteGuestsModal  
        emailsToInvite={emailsToInvite}
        addNewEmailToInvite={addNewEmailToInvite}
        closeGuestsModal={closeGuestsModal}
        removeEmailToInvite={removeEmailToInvite}

      />
    )}

    {/* Modal de confirmação */}

    {isConfirmTripModalOpen && (
      <ConfirmTripModal 
        closeConfirmTripModal={closeConfirmTripModal}
        createTrip={createTrip}
        setOwnerName={setOwnerName}
        setOwnerEmail={setOwnerEmail}
      />
    )}
  </div>
);
};

