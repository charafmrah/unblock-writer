import '../styles/loading.css';

export default function Loading({ instructions }) {
	return (
		<div className="w-full h-full min-h-[400px] flex justify-center items-center place-self-center">
			<div className="flex flex-col gap-5">
				<div class="typewriter">
					<div class="slide">
						<i></i>
					</div>
					<div class="paper"></div>
					<div class="keyboard"></div>
				</div>
				<div className="text-sm text-gray-600">{instructions}</div>
			</div>
		</div>
	);
}
