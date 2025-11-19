import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Card>
				<CardHeader>
					<CardTitle>Cargando Logs de Actividad...</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col gap-4 md:flex-row">
							<Skeleton className="h-10 w-full md:w-2/3" />
							<Skeleton className="h-10 w-full md:w-1/3" />
							<Skeleton className="h-10 w-full md:w-1/3" />
							<Skeleton className="h-10 w-full md:w-1/4" />
						</div>
						<div className="rounded-md border">
							<Skeleton className="h-12 w-full" /> {/* Table Header */}
							{Array.from({ length: 10 }).map((_, i) => (
								<Skeleton key={i} className="h-10 w-full border-b" />
							))}
						</div>
						<div className="flex items-center justify-end space-x-2 py-4">
							<Skeleton className="h-9 w-24" />
							<Skeleton className="h-9 w-24" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
