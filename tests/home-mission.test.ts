import { describe, expect, it } from "vitest";
import { buildMissionViewModel } from "@/lib/home/mission";

describe("home mission view model", () => {
  it("does not claim personalized weakness data for signed-out students", () => {
    expect(
      buildMissionViewModel({ level: "ssc", user: null, dashboard: null }),
    ).toMatchObject({
      personalized: false,
      title: "SSC Science Starter",
      href: "/ssc",
      streak: 0,
      rank: null,
    });
  });

  it("uses the weakest real chapter for a signed-in mission", () => {
    expect(
      buildMissionViewModel({
        level: "hsc",
        user: {
          id: "student-1",
          name: "Student",
          email: "student@example.com",
          role: "STUDENT",
          rank: 23,
        },
        dashboard: {
          weakChapters: [{ slug: "physics/chapter-03", count: 4 }],
          player: { streak: 6 },
        },
      }),
    ).toMatchObject({
      personalized: true,
      title: "পদার্থবিজ্ঞান · অধ্যায় ০৩",
      href: "/hsc/physics-1st-paper",
      streak: 6,
      rank: 23,
    });
  });

  it("falls back to the saved weak subject without inventing a chapter", () => {
    expect(
      buildMissionViewModel({
        level: "ssc",
        user: {
          id: "student-1",
          name: "Student",
          email: "student@example.com",
          role: "STUDENT",
          weakSubjects: "chemistry",
        },
        dashboard: { player: { streak: 2 } },
      }),
    ).toMatchObject({
      personalized: true,
      title: "রসায়ন ফোকাস",
      href: "/ssc/chemistry",
    });
  });
});
