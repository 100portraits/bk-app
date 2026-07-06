export const SUMMER_CLOSURE = {
	reopenDate: '17 August',
	/** First day normal operations resume (Aug 18) */
	endDate: new Date(2026, 7, 18),
	instagramUrl: 'https://www.instagram.com/bikekitchenuva/?hl=en',
	whatsappUrl: 'https://chat.whatsapp.com/CP244pZRyfcC2QhFW8BR9a',
} as const;

export const isSummerClosureActive = () => new Date() < SUMMER_CLOSURE.endDate;
