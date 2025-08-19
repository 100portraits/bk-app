'use client';

import { useState } from 'react';
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
import { IconInfoCircle } from '@tabler/icons-react';
import { mockAvailableDates, mockTimeSlots, mockUser } from '@/lib/placeholderData';

export default function BookingFormPage() {
  const [currentSection, setCurrentSection] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [repairTypes, setRepairTypes] = useState<string[]>([]);
  const [bikeType, setBikeType] = useState('');
  const [component, setComponent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [email, setEmail] = useState(mockUser.email);
  const [calendarProvider, setCalendarProvider] = useState('Google Calendar');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerText, setDisclaimerText] = useState('');

  const isLoggedIn = true;
  const isOtherSelected = repairTypes.includes('Other');

  const handleSectionComplete = (section: number) => {
    if (section === 2 && isOtherSelected) {
      setShowDisclaimer(true);
    } else {
      setCurrentSection(section + 1);
    }
  };

  const handleDisclaimerComplete = () => {
    setShowDisclaimer(false);
    setCurrentSection(3);
  };

  const getEstimatedTime = () => {
    if (repairTypes.includes('Tire/Tube')) return '45 minutes';
    if (repairTypes.includes('Chain')) return '30 minutes';
    if (repairTypes.includes('Brakes')) return '60 minutes';
    if (repairTypes.includes('Gears')) return '75 minutes';
    return '45 minutes';
  };

  const formatBookingSummary = () => {
    const repairText = repairTypes.join(', ');
    const dateText = selectedDate?.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    return `Your appointment to repair your ${repairText} will be at ${selectedTime} on ${dateText}`;
  };

  return (
    <AppLayout 
      title="Booking Form"
      showSearchIcon={true}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Make an appointment:
          </h1>
          <p className="text-gray-600">
            {isLoggedIn ? `logged in as ${mockUser.name} - participant/member` : 'not logged in - Guest'}
          </p>
        </div>

        {currentSection >= 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">1. About the BK</h2>
            <div className="space-y-3">
              <p className="text-gray-700 font-medium">
                At the Bike Kitchen, you repair your own bike:
              </p>
              <ul className="space-y-2 text-gray-600 ml-4">
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
                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to the{' '}
                    <a href="#" className="text-purple-600 underline">UvA Privacy Policy</a>
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {currentSection >= 2 && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">2. The Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">How much experience do you have fixing bikes?</span>
                <IconInfoCircle size={16} className="text-gray-400" />
              </div>
              <ExperienceSlider
                value={experienceLevel}
                onChange={setExperienceLevel}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Which part of your bike needs repair?</span>
                <IconInfoCircle size={16} className="text-gray-400" />
              </div>
              <RepairTypeSelector
                value={repairTypes}
                onChange={setRepairTypes}
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

        {currentSection >= 3 && repairTypes.length > 0 && !isOtherSelected && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">2b. Follow-up</h2>
            
            <div className="space-y-2">
              <span className="text-gray-700">You selected </span>
              <PillButton selected>{repairTypes[0]}</PillButton>
              <p className="text-gray-600">
                The duration of this repair can depend on some other information:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Is it a city bike or a road/mountain/touring bike?</span>
                <IconInfoCircle size={16} className="text-gray-400" />
              </div>
              <ToggleSelector
                options={[
                  { label: 'city bike', value: 'city' },
                  { label: 'road/mountain/touring bike', value: 'road' }
                ]}
                value={bikeType}
                onChange={setBikeType}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Is the repair for the front or the tire/tube?</span>
                <IconInfoCircle size={16} className="text-gray-400" />
              </div>
              <ToggleSelector
                options={[
                  { label: 'front', value: 'front' },
                  { label: 'tire/tube', value: 'tire' }
                ]}
                value={component}
                onChange={setComponent}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IconInfoCircle size={16} className="text-blue-500" />
                <span className="text-sm text-blue-700">about these questions</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Your repair will take around {getEstimatedTime()}.
              </p>
              <p className="text-xs text-gray-600">
                Keep in mind that this is an estimate - we don't like to rush at the Bike Kitchen!
              </p>
            </div>

            {currentSection === 3 && bikeType && component && (
              <PrimaryButton
                onClick={() => setCurrentSection(4)}
                fullWidth
              >
                Continue
              </PrimaryButton>
            )}
          </section>
        )}

        {currentSection >= 4 && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">3. The Calendar</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">What day?</h3>
              <CalendarWidget
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableDates={mockAvailableDates}
                highlightedDates={[new Date()]}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">What time?</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockTimeSlots.map((time) => (
                  <PillButton
                    key={time}
                    selected={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </PillButton>
                ))}
              </div>
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
            <h2 className="text-lg font-semibold text-gray-900">4. Confirmation</h2>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">
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
              <h3 className="font-medium text-gray-800">What is your email address?</h3>
              <TextInput
                type="email"
                value={email}
                onChange={setEmail}
                fullWidth
                className={isLoggedIn ? 'text-purple-600 border-purple-200' : ''}
              />
            </div>

            {currentSection === 5 && email && (
              <PrimaryButton
                onClick={() => setCurrentSection(6)}
                fullWidth
              >
                Looks good!
              </PrimaryButton>
            )}
          </section>
        )}

        {currentSection >= 6 && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">5. Add to Calendar</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['Google Calendar', 'Outlook', 'Apple'].map((provider) => (
                  <PillButton
                    key={provider}
                    selected={calendarProvider === provider}
                    onClick={() => setCalendarProvider(provider)}
                  >
                    {provider}
                  </PillButton>
                ))}
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  You will also receive a confirmation email at{' '}
                  <span className="text-purple-600 font-medium">{email}</span>
                </p>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">That's all</h3>
                <p className="text-gray-600">See you soon!</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <BottomSheetDialog
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="2a. A Disclaimer"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            You selected Other - tell us more about the repair, but be aware that for more tricky problems 
            the first appointment may be a diagnosis only:
          </p>
          <textarea
            value={disclaimerText}
            onChange={(e) => setDisclaimerText(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="There's a clicking noise every time I turn the pedals and I'm not sure where it's coming from!!!"
          />
          <PrimaryButton
            onClick={handleDisclaimerComplete}
            fullWidth
            disabled={!disclaimerText.trim()}
          >
            I understand
          </PrimaryButton>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}