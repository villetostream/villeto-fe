import Image from "next/image";

type SocialProofProps = {
  length?: number; // Number of visible avatars (default: 5)
};

const SocialProof: React.FC<SocialProofProps> = ({ length = 5 }) => {
  const avatars = [
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80",
  ];

  const visibleAvatars = avatars.slice(0, length);

  return (
    <div className="flex items-center gap-6 py-6">
      {/* Avatar Stack - Tailwind UI style */}
      <div className="flex -space-x-4 rtl:space-x-reverse">
        {visibleAvatars.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Customer avatar ${index + 1}`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover hover:z-10 transition-transform hover:-translate-y-1"
            style={{ zIndex: index + 1 }}
          />
        ))}

        {/* +Counter */}
        <a
          href="#"
          className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-black rounded-full hover:bg-gray-800 transition z-50"
        >
          +995
        </a>
      </div>

      {/* Social Proof Text */}
      <p className="text-base font-normal text-black">
        Join 1,000+ finance teams saving hundreds of hours every month.
      </p>
    </div>
  );
};

export default SocialProof;
