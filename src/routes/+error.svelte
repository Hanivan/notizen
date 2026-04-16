<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeftIcon, HouseIcon, NewspaperIcon } from 'phosphor-svelte';
	import { config } from '$lib/config';
	import { fade, fly, blur, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { browser } from '$app/environment';

	// Error code and message from page state
	let statusCode = $derived(page.status);
	let errorMessage = $derived(page.error?.message || 'Something went wrong');

	// Zen-inspired messages by error type
	let zenMessages = $derived.by(() => {
		const messages: Record<number, string[]> = {
			404: [
				'The path you seek has vanished like morning mist',
				'Even a wrong turn can lead to new discoveries',
				'In stillness, find your way back',
				'The page you seek exists only in memory',
				'Like a river, your journey must find another course',
				'What you seek is seeking you elsewhere',
				'The void between pages is where new paths form',
				'Every ending is also a beginning',
				'Be like water: flow around obstacles',
				'The destination has moved, but the journey continues',
				'Lost is just another word for exploring',
				'The digital winds have reshaped the landscape',
				'What was here has returned to the ether',
				'Your curiosity will lead you to new horizons',
				'The page you seek is like a cherry blossom: here, then gone'
			],
			500: [
				'The mountain rises, we must climb again',
				'Even in chaos, there is order',
				'Temporary setback, permanent progress',
				'The universe is rebalancing itself',
				'A moment of silence while systems realign',
				'The digital stream briefly lost its way',
				'Like seasons, systems must sometimes rest',
				'Even the strongest bamboo bends in the storm',
				'The foundation trembles, but holds firm',
				'In the space between errors, wisdom grows',
				'The machine meditates on what went wrong',
				'Patience: all things return to balance',
				'The ancestor of all things is the void',
				'Chaos precedes creation',
				'The great reset has begun'
			],
			403: [
				'This path is not meant for you',
				'Some doors remain closed for a reason',
				'Honor the boundaries',
				'Not all paths are meant to be walked',
				'Forbidden knowledge often protects itself',
				'The garden has a gate for a purpose',
				'Some chapters are written in invisible ink',
				'What is hidden is hidden for wisdom',
				'Acceptance is the first step to peace',
				'This sanctuary requires different keys',
				'Not every guest is meant for every room',
				'The barrier is the lesson',
				'Some treasures are not meant to be found',
				'Know when to stop, know when to turn back',
				'The veil exists for protection'
			],
			401: [
				'Identity must be proven',
				'The gatekeeper awaits your credentials',
				'Permission is required to proceed',
				'Who goes there? The threshold demands answers',
				'Your face is unknown to this realm',
				'The sacred space knows its own',
				'Identity is the key that unlocks all doors',
				'You must be known to enter',
				'The guardian asks: who are you?',
				'Your name is not written in the book',
				'Authenticity is required for passage',
				'The threshold recognizes only the initiated',
				'Prove your worthiness to proceed',
				'Your credentials are the bridge',
				'The sacred gate knows not your face'
			]
		};

		const statusMessages = messages[statusCode] || messages[500];
		return statusMessages[Math.floor(Math.random() * statusMessages.length)];
	});

	// Japanese text by error type
	let japaneseText = $derived.by(() => {
		const japanese: Record<number, { text: string; meaning: string }> = {
			404: { text: '迷子', meaning: 'lost child' },
			500: { text: '混乱', meaning: 'chaos' },
			403: { text: '禁', meaning: 'forbidden' },
			401: { text: '認証', meaning: 'authentication' }
		};

		return japanese[statusCode] || { text: '問題', meaning: 'problem' };
	});

	// Badge text
	let badgeText = $derived.by(() => {
		const badges: Record<number, string> = {
			404: 'Lost & Found',
			500: 'Server Error',
			403: 'Forbidden',
			401: 'Unauthorized'
		};

		return badges[statusCode] || 'Error';
	});

	// Simple floating animation state
	let floatY = $state(0);
	let rotateY = $state(0);

	// Animate the floating motion on mount
	if (browser) {
		let animationFrame: number;
		let startTime = Date.now();

		function animate() {
			const elapsed = Date.now() - startTime;
			const t = elapsed / 5000; // 5 second cycle

			floatY = Math.sin(t * Math.PI * 2) * 6;
			rotateY = Math.sin(t * Math.PI * 2 + Math.PI / 4) * 1;

			animationFrame = requestAnimationFrame(animate);
		}

		animate();
	}
</script>

<svelte:head>
	<title>{statusCode} - {errorMessage} | {config.site.name}</title>
	<meta name="description" content={errorMessage} />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-h-screen relative overflow-hidden flex items-center justify-center">
	<!-- Background layers -->
	<div class="absolute inset-0 pattern-seigaiha opacity-[0.03]"></div>
	<div class="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20"></div>

	<!-- Floating decorative circles -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div
			class="float-circle float-circle-1"
			style="transform: translateY({floatY * 0.5}px) rotate({rotateY * 0.3}deg)"
		></div>
		<div
			class="float-circle float-circle-2"
			style="transform: translateY({floatY * -0.3}px) rotate({rotateY * -0.2}deg)"
		></div>
	</div>

	<!-- Content -->
	<div class="container mx-auto px-4 relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Error Code Number -->
			<div class="relative mb-8 error-code-wrapper" style="transform: translateY({floatY}px)">
				<h1
					class="text-[12rem] md:text-[16rem] lg:text-[20rem] font-semibold leading-none tracking-tighter"
					in:fly={{ y: -30, opacity: 0, duration: 600, easing: quintOut }}
				>
					{statusCode}
				</h1>

				<!-- Decorative elements around error code -->
				<div
					class="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30"
					in:scale={{ start: 0.8, opacity: 0, duration: 400, delay: 200, easing: quintOut }}
				></div>
				<div
					class="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30"
					in:scale={{ start: 0.8, opacity: 0, duration: 400, delay: 300, easing: quintOut }}
				></div>

				<!-- Small Japanese accent -->
				<div
					class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full ml-8"
					in:blur={{ amount: 8, opacity: 0, duration: 500, delay: 400, easing: quintOut }}
				>
					<div class="text-6xl md:text-8xl opacity-20">{japaneseText.text}</div>
					<div class="text-xs text-muted-foreground mt-2">{japaneseText.meaning}</div>
				</div>
			</div>

			<!-- Message -->
			<div in:fly={{ y: 20, opacity: 0, duration: 500, delay: 150, easing: quintOut }}>
				<div class="mb-6">
					<span
						class="badge-accent"
						in:scale={{ start: 0.9, duration: 300, delay: 200, easing: quintOut }}
					>
						{badgeText}
					</span>
				</div>
				<h2 class="zen-message text-2xl md:text-3xl lg:text-4xl font-medium mb-6 leading-relaxed">
					{zenMessages}
				</h2>
				<p class="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
					{errorMessage}
				</p>
			</div>

			<!-- Decorative divider -->
			<div
				class="divider-japanese max-w-xs mx-auto my-12"
				in:fly={{ x: -10, opacity: 0, duration: 400, delay: 350, easing: quintOut }}
			></div>

			<!-- Action buttons -->
			<div
				class="flex flex-col sm:flex-row items-center justify-center gap-4"
				in:fade={{ duration: 400, delay: 500, easing: quintOut }}
			>
				<a
					href="/"
					class="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-japanese"
				>
					<HouseIcon size={20} weight="thin" />
					<span>Go Home</span>
					<ArrowLeftIcon
						size={18}
						weight="bold"
						class="group-hover:translate-x-1 group-hover:rotate-180 transition-transform"
					/>
				</a>

				<a
					href="/blog"
					class="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-border rounded-lg font-medium hover:bg-accent hover:border-primary/30 transition-all duration-300"
				>
					<NewspaperIcon size={20} weight="thin" />
					<span>Read Blog</span>
					<ArrowLeftIcon
						size={18}
						class="group-hover:translate-x-1 transition-transform"
					/>
				</a>
			</div>

			<!-- Helpful suggestions -->
			<div
				class="mt-16 p-8 border border-border/40 rounded-lg bg-muted/20 max-w-2xl mx-auto"
				in:fly={{ y: 15, opacity: 0, duration: 500, delay: 650, easing: quintOut }}
			>
				<h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
					You might be looking for
				</h3>
				<div class="space-y-3">
					<a
						href="/blog"
						class="group flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50"
						in:fly={{ x: -10, opacity: 0, duration: 350, delay: 750, easing: quintOut }}
					>
						<div
							class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0"
						>
							<NewspaperIcon size={20} weight="thin" />
						</div>
						<div class="flex-1">
							<div class="font-medium group-hover:text-primary transition-colors mb-1">
								Blog Articles
							</div>
							<div class="text-xs text-muted-foreground">Latest tutorials and insights</div>
						</div>
						<ArrowLeftIcon
							size={16}
							class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100"
						/>
					</a>

					<a
						href="/"
						class="group flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50"
						in:fly={{ x: -10, opacity: 0, duration: 350, delay: 800, easing: quintOut }}
					>
						<div
							class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0"
						>
							<HouseIcon size={20} weight="thin" />
						</div>
						<div class="flex-1">
							<div class="font-medium group-hover:text-primary transition-colors mb-1">
								Homepage
							</div>
							<div class="text-xs text-muted-foreground">Start from the beginning</div>
						</div>
						<ArrowLeftIcon
							size={16}
							class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100"
						/>
					</a>
				</div>
			</div>

			<!-- Zen quote -->
			<div
				class="mt-12 mb-4 text-muted-foreground/60 text-sm italic"
				in:fade={{ duration: 600, delay: 1000, easing: quintOut }}
			>
				"七転び八起き" - Fall seven times, stand up eight
			</div>
		</div>
	</div>
</main>

<style>
	/* Smooth page transitions */
	a {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Float circles */
	.float-circle {
		position: absolute;
		border-radius: 9999px;
		background-color: rgb(var(--color-primary) / 0.05);
		filter: blur(3rem);
	}

	.float-circle-1 {
		top: 25%;
		left: 25%;
		width: 16rem;
		height: 16rem;
	}

	.float-circle-2 {
		bottom: 25%;
		right: 25%;
		width: 24rem;
		height: 24rem;
	}

	/* Zen message font */
	.zen-message {
		font-family: 'Cormorant Garamond', serif;
	}

	/* Accessibility: reduce motion preference */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
