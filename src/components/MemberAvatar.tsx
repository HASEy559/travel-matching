import type { Member } from '../types'

interface MemberAvatarProps {
  member: Pick<Member, 'badge' | 'color' | 'name'>
  size?: 'sm' | 'md' | 'lg'
}

export function MemberAvatar({ member, size = 'md' }: MemberAvatarProps) {
  return (
    <span
      className={`member-avatar member-avatar--${size}`}
      style={{ backgroundColor: member.color }}
      title={member.name}
      aria-label={member.name}
    >
      {member.badge}
    </span>
  )
}

