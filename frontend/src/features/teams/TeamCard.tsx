import { Link } from "react-router-dom";
import { ArrowRight, Copy} from "lucide-react";
import Card from "../../components/ui/Card";
import type { Team } from "./teamTypes";

type Props = {
  team: Team;
};

export default function TeamCard({ team }: Props) {
  const memberCount = team.members?.length ?? 0;
  const initials = team.name.slice(0, 1).toUpperCase();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(team._id);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {team.name}
            </h3>
            <p className="text-sm text-slate-500">
              {memberCount} member{memberCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Copy team ID"
          >
            <Copy size={18} />
          </button>

          <Link
            to={`/teams/${team._id}`}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Open team"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </Card>
  );
}