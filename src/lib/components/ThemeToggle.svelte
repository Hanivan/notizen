<script lang="ts">
	import { Sun, Moon, Monitor } from 'phosphor-svelte';
	import { setMode, resetMode } from 'mode-watcher';
	import { DropdownMenu } from 'bits-ui';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input text-foreground hover:bg-accent inline-flex h-10 w-10 select-none items-center justify-center rounded-md border text-sm font-medium transition-colors"
	>
		<Sun
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			weight="fill"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			weight="fill"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end" class="min-w-[160px]">
		<DropdownMenu.Item onclick={() => setMode('light')}>
			<div class="flex items-center gap-2">
				<Sun weight="fill" />
				<span>Light</span>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode('dark')}>
			<div class="flex items-center gap-2">
				<Moon weight="fill" />
				<span>Dark</span>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode()}>
			<div class="flex items-center gap-2">
				<Monitor weight="fill" />
				<span>System</span>
			</div>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
