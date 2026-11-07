import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <main className="flex flex-1 justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <ProfileHeader
          name={profile.name}
          bio={profile.bio}
          image={profile.image}
        />
        <LinkList links={profile.links} />
      </div>
    </main>
  );
}
