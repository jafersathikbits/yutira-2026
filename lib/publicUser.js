/** Fields that are safe to send to the browser (never password or token hashes). */
export const PUBLIC_USER_FIELDS =
  '_id yutiraId name email phone college department year isPSG general workshop attendance emailVerified createdAt';

export function toPublicUser(u) {
  if (!u) return null;
  return {
    _id: String(u._id),
    yutiraId: u.yutiraId || null,
    name: u.name,
    email: u.email,
    phone: u.phone,
    college: u.college,
    department: u.department,
    year: u.year,
    isPSG: !!u.isPSG,
    general: {
      selected: !!u.general?.selected,
      paymentStatus: u.general?.paymentStatus || 'pending',
      paidAt: u.general?.paidAt || null
    },
    workshop: {
      selected: !!u.workshop?.selected,
      paymentStatus: u.workshop?.paymentStatus || 'pending',
      paidAt: u.workshop?.paidAt || null
    },
    attendance: { day1: !!u.attendance?.day1, day2: !!u.attendance?.day2 },
    emailVerified: !!u.emailVerified,
    createdAt: u.createdAt
  };
}

export function toPublicPaper(p) {
  if (!p) return null;
  return {
    title: p.title,
    degree: p.degree,
    yearOfStudy: p.yearOfStudy,
    otherAuthors: p.otherAuthors,
    status: p.status,
    remarks: p.remarks || '',
    pdfUrl: p.pdfUrl,
    submittedAt: p.submittedAt
  };
}
