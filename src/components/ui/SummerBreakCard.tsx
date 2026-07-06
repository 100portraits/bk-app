'use client';

import { IconSun, IconBrandInstagram, IconBrandWhatsapp } from '@tabler/icons-react';
import { SUMMER_CLOSURE } from '@/lib/summerClosure';

type SummerBreakCardProps = {
	variant?: 'landing' | 'section';
};

const SocialPills = () => (
	<div className="flex items-center justify-center gap-2 mt-3">
		<a
			href={SUMMER_CLOSURE.whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
		>
			<IconBrandWhatsapp size={14} />
			WhatsApp
		</a>
		<a
			href={SUMMER_CLOSURE.instagramUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
		>
			<IconBrandInstagram size={14} />
			Instagram
		</a>
	</div>
);

const SummerBreakCard = ({ variant = 'landing' }: SummerBreakCardProps) => {
	const body = (
		<>
			<p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
				We&apos;ll reopen on {SUMMER_CLOSURE.reopenDate}, see you soon! Join our WhatsApp community and follow us on
				Instagram to stay up to date and join our summer events!
			</p>
			<SocialPills />
		</>
	);

	if (variant === 'section') {
		return (
			<section className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-5">
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
						<IconSun size={20} className="text-amber-600 dark:text-amber-400" />
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1.5">Summer Break</h2>
						{body}
					</div>
				</div>
			</section>
		);
	}

	return (
		<div className="max-w-md w-full text-center">
			<div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-6">
				<div className="w-11 h-11 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
					<IconSun size={22} className="text-amber-600 dark:text-amber-400" />
				</div>
				<h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Summer Break</h2>
				{body}
			</div>
		</div>
	);
};

export default SummerBreakCard;
