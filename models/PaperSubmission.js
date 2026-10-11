import mongoose from 'mongoose';

const PaperSubmissionSchema = new mongoose.Schema(
  {
    yutiraId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },

    title: { type: String, required: true },
    degree: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    otherAuthors: { type: String, required: true },

    pdfUrl: { type: String, required: true },

    status: { type: String, enum: ['submitted', 'accepted', 'rejected'], default: 'submitted' },
    remarks: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' } }
);

export default mongoose.models.PaperSubmission || mongoose.model('PaperSubmission', PaperSubmissionSchema);
