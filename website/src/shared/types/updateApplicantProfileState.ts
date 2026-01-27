export interface updateApplicantProfileState {
  currentRole: string;
  profileUrl: string;
  backgroundUrl: string;
  biography: string;
  country: string;
  state: string;
  city: string;
  phoneNumber?: string;
  gender: string;
  experiences: Experience[];
}

interface Experience {
  title: string;
  employmentType: "Full Time" | "Part Time" | "Contract" | "Internship"; // You can expand this as needed
  company: string;
  description: string;
  state: string;
  city: string;
    startDate: string;
  endDate?: string;
  applicantId: string;
}
