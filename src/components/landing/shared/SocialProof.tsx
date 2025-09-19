import React from 'react';

const SocialProof = ({ length = 3 }: { length?: number }) => {
    // Sample avatar URLs - in a real app these would come from your data
    const avatars = [
        "/images/tech-glow.webp",
        "/images/tech-glow.webp",
        "/images/tech-glow.webp",
        "/images/tech-glow.webp",
        "/images/tech-glow.webp",
        "/images/tech-glow.webp",
    ];

    return (
        <div className="flex items-center gap-4 py-6">
            {/* Avatar Stack */}
            <div className="flex -space-x-3">
                {avatars.splice(0, length).map((avatar, index) => (
                    <div
                        key={index}
                        className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden ring-2 ring-border"
                    >
                        <img
                            src={avatar}
                            alt={`Customer ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                <div className="relative w-12 h-12 rounded-full bg-muted border-2 border-background ring-2 ring-border flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">+995</span>
                </div>
            </div>

            {/* Social Proof Text */}
            <p className="text-black text-base font-normal">
                Join 1,000+ finance teams saving hundreds of hours every month.
            </p>
        </div>
    );
};

export default SocialProof;