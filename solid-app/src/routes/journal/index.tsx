export default function Journal() {
    return (
        <div class="m-4">
            <h1 class="">Journal</h1>
            <div class="flex flex-col gap-2 mt-2">
                <a href="/journal/medications" class="hover:text-blue-500">
                    Medications
                </a>
                <a href="/journal/notes" class="hover:text-blue-500">
                    Notes
                </a>
                <a href="/journal/mood-tracker" class="hover:text-blue-500">
                    Mood Tracker
                </a>
                <a href="/journal/meal-tracker" class="hover:text-blue-500">
                    Meal Tracker
                </a>
                <a href="/journal/sleep-tracker" class="hover:text-blue-500">
                    Sleep Tracker
                </a>
            </div>
        </div>
    );
}