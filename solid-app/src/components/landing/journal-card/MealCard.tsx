import { JournalCard } from "./JournalCard";
import NutritionIcon from "../../icon/nutrition-icon";
import { formatCreatedDate } from "../../../lib/formateDateLocal";
import { MealWithNoteUser } from "@/schema/Meals";

const MealCard = ({ meal }: { meal: MealWithNoteUser }) => (
  <JournalCard
    dateTime={formatCreatedDate(meal.createdAt)}
    title="Nutrition"
    value={"nutrition"}
    withMember={true}
    member={meal.user}
    entryId={meal.id}
    icon={
      <NutritionIcon
        width="14"
        height="14"
        iconColor="#6FC94F"
        bgColor="#19370E"
      />
    }
    sections={[
      {
        title: "Meal Type",
        content: <p class="text-subtitle">{meal.category}</p>,
      },
      {
        title: `How much did ${meal.recipient!.firstName} eat?`,
        content: (
          <p class="text-subtitle">
            {meal.recipient!.firstName} ate {meal.consumption.toLowerCase()} of
            her meal.
          </p>
        ),
      },
      ...(meal.foodName
        ? [
            {
              title: "Food Name",
              content: <p class="text-subtitle">{meal.foodName}</p>,
            },
          ]
        : []),
      ...(meal.drinkName
        ? [
            {
              title: "Drink Name",
              content: <p class="text-subtitle">{meal.drinkName}</p>,
            },
          ]
        : []),
      {
        title: "Date",
        content: (
          <p class="text-subtitle text-black/75">
            {meal.date.toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        ),
      },
      ...(meal.note
        ? [
            {
              title: "Additional Notes",
              content: <p class="text-subtitle">{meal.note.note}</p>,
            },
          ]
        : []),
    ]}
  />
);

export default MealCard;
