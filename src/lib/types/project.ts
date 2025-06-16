export type Project = {
	id?: number;
	title: string;
	description: string;
	category?: string;
	tech: string[];
	image: string;
	demo: string;
	github: string;
	featured?: boolean;
};
