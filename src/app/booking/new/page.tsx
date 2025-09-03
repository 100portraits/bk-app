'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ExperienceSlider from '@/components/ui/ExperienceSlider';
import RepairTypeSelector from '@/components/ui/RepairTypeSelector';
import CalendarWidget from '@/components/ui/CalendarWidget';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import PillButton from '@/components/ui/PillButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconInfoCircle, IconLoader2, IconCheck, IconPencil, IconBrandGoogle, IconBrandWindows, IconBrandApple, IconClock } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import { TimeSlot, toDbRepairType, getRepairDuration, RepairDetails } from '@/types/bookings';
import { log } from 'console';

export default function BookingFormPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { getAvailableSlots, getAvailableDates, createBooking } = useAvailableSlots();

  const [currentSection, setCurrentSection] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState(1);
  const [repairTypes, setRepairTypes] = useState<string[]>([]);
  const [bikeType, setBikeType] = useState('');
  const [wheelPosition, setWheelPosition] = useState('');
  const [brakeType, setBrakeType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [email, setEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerText, setDisclaimerText] = useState('');
  const [repairLocked, setRepairLocked] = useState(false);

  // API state
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);

  const isLoggedIn = !!user;
  const selectedRepairType = repairTypes[0] || '';
  const isOtherSelected = selectedRepairType === 'Other';
  const isWheelSelected = selectedRepairType === 'Wheel';

  // Calculate repair duration based on selections
  const repairDetails: RepairDetails = {
    wheelPosition: wheelPosition as 'front' | 'rear',
    bikeType: bikeType as 'city' | 'road',
    brakeType: brakeType as 'rim' | 'coaster' | 'disc',
    description: isOtherSelected ? disclaimerText : undefined
  };
  const repairDuration = getRepairDuration(selectedRepairType, repairDetails);

  // Load available dates when component mounts
  useEffect(() => {
    loadAvailableDates();
  }, []);

  // Set user email when profile loads
  useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  const loadAvailableDates = async () => {
    setLoadingDates(true);
    try {
      const dates = await getAvailableDates(4);
      setAvailableDates(dates);
    } catch (error) {
      console.error('Error loading available dates:', error);
    } finally {
      setLoadingDates(false);
    }
  };

  const loadAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedTime('');

    try {
      const slots = await getAvailableSlots(date, repairDuration);
      if (slots.length > 0) {
        // Use the first shift's slots (typically only one shift per day)
        setSelectedShiftId(slots[0].shift_id);
        setAvailableSlots(slots[0].slots);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setLoadingSlots(false);
      scrollToEnd();

    }
  };

  const handleSectionComplete = (section: number) => {
    if (section === 2) {
      // Lock the repair type selection
      setRepairLocked(true);

      if (isOtherSelected) {
        setDisclaimerText('');
        setShowDisclaimer(true);
      } else if (isWheelSelected) {
        // Show wheel disclaimer
        setDisclaimerText('Truing wheels can be tricky - if more than 4 spokes are broken we recommend just getting a new wheel. But if you\'re up for the challenge and have a few hours then come by!');
        setShowDisclaimer(true);
      } else {
        // For repairs that need follow-up questions, go to section 3
        setCurrentSection(3);
      }
    } else {
      setCurrentSection(section + 1);
    }
  };

  const handleDisclaimerComplete = () => {
    setShowDisclaimer(false);
    // Always go to calendar (section 4) after disclaimer
    // Section 3 is follow-up which happens before disclaimers
    setCurrentSection(4);
  };

  const getEstimatedTime = () => {
    switch (selectedRepairType) {
      case 'Tire/Tube':
        if (wheelPosition === 'front') return '30 minutes';
        if (wheelPosition === 'rear' && bikeType === 'city') return '60 minutes';
        if (wheelPosition === 'rear' && bikeType === 'road') return '40 minutes';
        return '45 minutes';
      case 'Chain':
        if (bikeType === 'city') return '45 minutes';
        if (bikeType === 'road') return '30 minutes';
        return '35 minutes';
      case 'Brakes':
        if (brakeType === 'rim') return '30 minutes';
        if (brakeType === 'coaster') return '40 minutes';
        if (brakeType === 'disc') return '45 minutes';
        return '35 minutes';
      case 'Gears':
        if (bikeType === 'city') return '60 minutes';
        if (bikeType === 'road') return '40 minutes';
        return '45 minutes';
      case 'Wheel':
        return '60 minutes';
      case 'Other':
        return '45 minutes';
      default:
        return '45 minutes';
    }
  };

  const formatBookingSummary = () => {
    const repairText = selectedRepairType;
    const dateText = selectedDate?.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return `Your appointment to repair your ${repairText} will be at ${selectedTime} on ${dateText}`;
  };

  const getEventDetails = () => {
    if (!selectedDate || !selectedTime) return null;

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + repairDuration);

    return {
      title: `Bike Kitchen - ${selectedRepairType} Repair`,
      startDateTime,
      endDateTime,
      location: 'Bike Kitchen UvA, Roeterseiland Campus, Roetersstraat 11, 1018 WB Amsterdam, Netherlands',
      description: `Appointment for ${selectedRepairType} repair.\nEstimated duration: ${repairDuration} minutes.\n\nRemember to bring:\n- Your bike\n- Any replacement parts needed\n- Your enthusiasm to learn!\n\nSee you at the Bike Kitchen!`
    };
  };

  const handleGoogleCalendar = () => {
    const event = getEventDetails();
    if (!event) return;

    const startStr = event.startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = event.endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', event.title);
    googleCalendarUrl.searchParams.append('dates', `${startStr}/${endStr}`);
    googleCalendarUrl.searchParams.append('location', event.location);
    googleCalendarUrl.searchParams.append('details', event.description);

    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const handleOutlookCalendar = () => {
    const event = getEventDetails();
    if (!event) return;

    const startStr = event.startDateTime.toISOString();
    const endStr = event.endDateTime.toISOString();

    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    outlookUrl.searchParams.append('subject', event.title);
    outlookUrl.searchParams.append('startdt', startStr);
    outlookUrl.searchParams.append('enddt', endStr);
    outlookUrl.searchParams.append('location', event.location);
    outlookUrl.searchParams.append('body', event.description);
    outlookUrl.searchParams.append('allday', 'false');

    window.open(outlookUrl.toString(), '_blank');
  };

  const handleAppleCalendar = () => {
    const event = getEventDetails();
    if (!event) return;

    // Create ICS file content
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, -1);
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bike Kitchen//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@bikekitchen.nl`,
      `DTSTAMP:${formatDate(new Date())}Z`,
      `DTSTART:${formatDate(event.startDateTime)}Z`,
      `DTEND:${formatDate(event.endDateTime)}Z`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create and download the ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bike-kitchen-${selectedRepairType.toLowerCase()}-${selectedDate?.toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCreateBooking = async () => {
    if (!selectedShiftId || !selectedTime || !selectedDate) return;

    setCreatingBooking(true);
    try {
      await createBooking({
        shift_id: selectedShiftId,
        slot_time: selectedTime,
        duration_minutes: repairDuration,
        repair_type: toDbRepairType(selectedRepairType),
        repair_details: repairDetails,
        notes: disclaimerText || undefined,
        is_member: profile?.member || false,
        email: email // Pass the email (either profile email or edited email)
      });

      setBookingCreated(true);
      setCurrentSection(6);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setCreatingBooking(false);
    }
  };

  const pageEndRef = useRef<HTMLDivElement>(null);
  const scrollToEnd = () => {
    pageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToEnd();
  }, [currentSection]);

  return (
    <AppLayout
      title="Booking Form"

    >
      <div className="space-y-8">
        <div className="">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Make an appointment:
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {isLoggedIn ? `Logged in as ${profile?.name || 'Loading...'} - ${profile?.member ? 'Member' : 'Guest'}` : 'Not logged in - Guest'}
          </p>
        </div>

        {currentSection >= 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">1. About the BK</h2>
            <div className="space-y-3">
              <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                At the Bike Kitchen, you repair your own bike:
              </p>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
                <li>• We have the tools, but you need to bring your own parts.</li>
                <li>• This is a learning space - are you ready to get your hands dirty?</li>
              </ul>

              {currentSection === 1 && (
                <div className="space-y-4">
                  <PrimaryButton
                    onClick={() => handleSectionComplete(1)}
                    fullWidth
                  >
                    I understand!
                  </PrimaryButton>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 ">
                    By proceeding, you agree to the{' '}
                    <a href="#" className="text-accent-600 dark:text-accent-400 underline">UvA Privacy Policy</a>
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {currentSection >= 2 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">2. The Details</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-700 dark:text-zinc-300">How much experience do you have fixing bikes?</span>

                {repairLocked && (
                  <span className="text-xs text-green-600 font-medium">(Confirmed)</span>
                )}
              </div>
              <div className=''>
                <ExperienceSlider
                  value={experienceLevel}
                  onChange={setExperienceLevel}
                  disabled={repairLocked}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-700 dark:text-zinc-300">Which part of your bike needs repair?</span>

                {repairLocked && (
                  <span className="text-xs text-green-600 font-medium">(Confirmed)</span>
                )}
              </div>
              <RepairTypeSelector
                value={repairTypes}
                onChange={(value) => {
                  setRepairTypes(value);
                  // Reset follow-up states when changing repair type
                  setBikeType('');
                  setWheelPosition('');
                  setBrakeType('');
                }}
                singleSelect={true}
                disabled={repairLocked}
              />
            </div>

            {currentSection === 2 && repairTypes.length > 0 && (
              <PrimaryButton
                onClick={() => handleSectionComplete(2)}
                fullWidth
              >
                Continue
              </PrimaryButton>
            )}
          </section>
        )}

        {currentSection >= 3 && repairTypes.length > 0 && !isOtherSelected && !isWheelSelected && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">2b. Follow-up</h2>

            <div className="space-y-2">
              <span className="text-zinc-700 dark:text-zinc-300">You selected </span>
              <PillButton selected>{selectedRepairType}</PillButton>
              <p className="text-zinc-600 dark:text-zinc-400">
                The duration of this repair can depend on some other information:
              </p>
            </div>

            {/* Tire/Tube specific questions */}
            {selectedRepairType === 'Tire/Tube' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-700 dark:text-zinc-300">Is it the front or rear tire/tube?</span>

                  </div>
                  <ToggleSelector
                    options={[
                      { label: 'Front', value: 'front' },
                      { label: 'Rear', value: 'rear' }
                    ]}
                    value={wheelPosition}
                    onChange={setWheelPosition}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-700 dark:text-zinc-300">Is it a city bike or a road/mountain/touring bike?</span>

                  </div>
                  <ToggleSelector
                    options={[
                      { label: 'City bike', value: 'city' },
                      { label: 'Road/mountain/touring bike', value: 'road' }
                    ]}
                    value={bikeType}
                    onChange={setBikeType}
                  />
                </div>
              </>
            )}

            {/* Chain specific questions */}
            {selectedRepairType === 'Chain' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700">Is it a city bike or a road/mountain/touring bike?</span>

                </div>
                <ToggleSelector
                  options={[
                    { label: 'City bike', value: 'city' },
                    { label: 'Road/mountain/touring bike', value: 'road' }
                  ]}
                  value={bikeType}
                  onChange={setBikeType}
                />
              </div>
            )}

            {/* Brakes specific questions */}
            {selectedRepairType === 'Brakes' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700 dark:text-zinc-300">What type of brakes does your bike have?</span>

                </div>
                <ToggleSelector
                  options={[
                    { label: 'Rim brakes', value: 'rim' },
                    { label: 'Coaster/drum brakes', value: 'coaster' },
                    { label: 'Disc brakes', value: 'disc' }
                  ]}
                  value={brakeType}
                  onChange={setBrakeType}
                />
              </div>
            )}

            {/* Gears specific questions */}
            {selectedRepairType === 'Gears' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700">Is it a city bike or a road/mountain/touring bike?</span>

                </div>
                <ToggleSelector
                  options={[
                    { label: 'City bike', value: 'city' },
                    { label: 'Road/mountain/touring bike', value: 'road' }
                  ]}
                  value={bikeType}
                  onChange={setBikeType}
                />
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IconClock size={16} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Your repair will take around {getEstimatedTime()}.</span>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IconInfoCircle size={16} className="text-orange-500 dark:text-orange-400" />
                <span className="text-sm text-orange-700 dark:text-orange-300">Why these questions?</span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Repairing city bikes often takes longer, especially when dealing with the rear wheel. Taking apart brakes, shifters and chain guards can take most of the time.
              </p>

            </div>

            {currentSection === 3 && (
              (selectedRepairType === 'Tire/Tube' && wheelPosition && bikeType) ||
              (selectedRepairType === 'Chain' && bikeType) ||
              (selectedRepairType === 'Brakes' && brakeType) ||
              (selectedRepairType === 'Gears' && bikeType)
            ) && (
                <PrimaryButton
                  onClick={() => {
                    // Check if disc brakes need disclaimer
                    if (selectedRepairType === 'Brakes' && brakeType === 'disc') {
                      setDisclaimerText('Working on disc brakes is tricky - we suggest you come on Thursday as our mechanic working then knows more about them.');
                      setShowDisclaimer(true);
                    } else {
                      setCurrentSection(4);
                    }
                  }}
                  fullWidth
                >
                  Continue
                </PrimaryButton>
              )}
          </section>
        )}

        {currentSection >= 4 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">3. The Calendar</h2>

            <div className="space-y-4">
              <h3 className="font-medium text-zinc-800 dark:text-zinc-200">What day?</h3>
              {loadingDates ? (
                <div className="flex items-center justify-center h-64">
                  <IconLoader2 className="animate-spin" size={24} />
                </div>
              ) : (
                <CalendarWidget
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      loadAvailableSlots(date);
                    };
                  }}
                  availableDates={availableDates}
                  highlightedDates={[]}
                />
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-zinc-800 dark:text-zinc-200">What time?</h3>
              {loadingSlots ? (
                <div className="flex items-center justify-center h-32">
                  <IconLoader2 className="animate-spin" size={24} />
                </div>
              ) : availableSlots.length === 0 && selectedDate ? (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                  <p>No available slots for this date.</p>
                  <p className="text-sm mt-2">Please select another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <PillButton
                      key={slot.time}
                      selected={selectedTime === slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={!slot.available ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {slot.time}
                      {!slot.available && slot.reason === 'booked' && (
                        <span className="text-xs ml-1">(Booked)</span>
                      )}
                      {!slot.available && slot.reason === 'insufficient_time' && (
                        <span className="text-xs ml-1">(Too late)</span>
                      )}
                    </PillButton>
                  ))}
                </div>
              )}
            </div>

            {currentSection === 4 && selectedDate && selectedTime && (
              <PrimaryButton
                onClick={() => setCurrentSection(5)}
                fullWidth
              >
                Continue
              </PrimaryButton>
            )}
          </section>
        )}

        {currentSection >= 5 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">4. Confirmation</h2>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                {formatBookingSummary()}
              </p>
              <div className="flex flex-wrap gap-2">
                <PillButton selected>{repairTypes[0]}</PillButton>
                <PillButton selected>{selectedTime}</PillButton>
                <PillButton selected>
                  {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </PillButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-zinc-800 dark:text-zinc-200">Confirmation email will be sent to:</h3>
              {editingEmail ? (
                <div className="flex gap-2">
                  <TextInput
                    type="email"
                    value={email}
                    onChange={setEmail}
                    fullWidth
                    placeholder="Enter email address"
                    autoFocus
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        setEditingEmail(false);
                      }
                    }}
                  />
                  <PrimaryButton
                    onClick={() => setEditingEmail(false)}
                    size="sm"
                  >
                    Save
                  </PrimaryButton>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-950 rounded-lg">
                  <span className="text-accent-900 dark:text-accent-100 font-medium">{email || 'Loading...'}</span>
                  <button
                    onClick={() => setEditingEmail(true)}
                    className="p-2 hover:bg-accent-100 dark:hover:bg-accent-900 rounded-lg transition-colors"
                    title="Edit email"
                  >
                    <IconPencil size={18} className="text-accent-600 dark:text-accent-400" />
                  </button>
                </div>
              )}
              {email !== profile?.email && email && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Note: Using a different email than your account ({profile?.email})
                </p>
              )}
            </div>

            {currentSection === 5 && email && (
              <PrimaryButton
                onClick={handleCreateBooking}
                fullWidth
                disabled={creatingBooking}
              >
                {creatingBooking ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconLoader2 className="animate-spin" size={20} />
                    Creating booking...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </PrimaryButton>
            )}
          </section>
        )}

        {currentSection >= 6 && bookingCreated && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">5. Booking Confirmed!</h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="text-green-600 dark:text-green-400" size={24} />
                  <span className="font-semibold text-green-900 dark:text-green-100">Your booking is confirmed!</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {formatBookingSummary()}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-zinc-800 dark:text-zinc-200">Add to Calendar:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleGoogleCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                  >
                    <IconBrandGoogle size={18} />
                    <span>Google Calendar</span>
                  </button>
                  <button
                    onClick={handleOutlookCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                  >
                    <IconBrandWindows size={18} />
                    <span>Outlook</span>
                  </button>
                  <button
                    onClick={handleAppleCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                  >
                    <IconBrandApple size={18} />
                    <span>Apple Calendar</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-accent-50 dark:bg-accent-950 rounded-lg">
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  You will also receive a confirmation email at{' '}
                  <span className="text-accent-600 dark:text-accent-400 font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-zinc-900 dark:text-white">That's all</h3>
                <p className="text-zinc-600 dark:text-zinc-400">See you soon at the Bike Kitchen!</p>
              </div>

              <div className="flex gap-3">
                <PrimaryButton
                  onClick={() => router.push('/booking/manage')}
                  fullWidth
                >
                  View My Bookings
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => router.push('/')}
                  fullWidth
                >
                  Back to Home
                </SecondaryButton>
              </div>
            </div>
          </section>
        )}
        <div ref={pageEndRef} className="pb-10"></div>
      </div>

      <BottomSheetDialog
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="2a. A Disclaimer"
      >
        <div className="space-y-4">
          {isOtherSelected ? (
            <>
              <p className="text-zinc-700 dark:text-zinc-300">
                You selected Other - tell us more about the repair, but be aware that for more tricky problems
                the first appointment may be a diagnosis only:
              </p>
              <textarea
                value={disclaimerText}
                onChange={(e) => setDisclaimerText(e.target.value)}
                className="w-full p-3 border border-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg resize-none"
                rows={4}
                placeholder="There's a clicking noise every time I turn the pedals and I'm not sure where it's coming from!!!"
              />
            </>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-600 rounded-lg">
              <p className="text-zinc-700 dark:text-zinc-300">
                {disclaimerText}
              </p>
            </div>
          )}
          <PrimaryButton
            onClick={handleDisclaimerComplete}
            fullWidth
            disabled={isOtherSelected && !disclaimerText.trim()}
          >
            I understand
          </PrimaryButton>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}