export const ssr = false;

export function load({ params }) {
	return {
		draft_id: params.draft_id
	};
}