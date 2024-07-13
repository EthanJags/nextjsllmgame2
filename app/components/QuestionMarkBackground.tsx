import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Group, Vector3, Euler, BufferGeometry, Points, PointsMaterial, BufferAttribute, TorusGeometry, CircleGeometry } from 'three'


// Star field component
function StarField() {
    const { scene } = useThree()
    const starsGeometry = useMemo(() => {
      const geometry = new BufferGeometry()
      const starsCount = 1000
      const positions = new Float32Array(starsCount * 3)
  
      for (let i = 0; i < starsCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      }
  
      geometry.setAttribute('position', new BufferAttribute(positions, 3))
      return geometry
    }, [])
  
    const starsMaterial = useMemo(() => new PointsMaterial({ color: 0xFFFFFF, size: 0.1 }), [])
  
    return <points geometry={starsGeometry} material={starsMaterial} />
  }

function QuestionMark({ initialPosition, scale, initialVelocity, initialRotation }: 
    { initialPosition: Vector3, scale: number, initialVelocity: Vector3, initialRotation: Euler }) {
    const groupRef = useRef<Group>(null!)
    const direction = useRef(initialVelocity).current

    
  
    useFrame((state, delta) => {
      if (groupRef.current) {
        groupRef.current.rotation.x += 0.005
        groupRef.current.rotation.y += 0.005
  
        // Update position
        groupRef.current.position.add(direction.clone().multiplyScalar(delta))
  
        // Check boundaries and reverse direction if needed
        const pos = groupRef.current.position
        if (Math.abs(pos.x) > 10) direction.setX(-direction.x)
        if (Math.abs(pos.y) > 10) direction.setY(-direction.y)
        if (Math.abs(pos.z) > 10) direction.setZ(-direction.z)
      }
    })
  
    return (
      <group ref={groupRef} position={initialPosition} scale={[scale, scale, scale]} rotation={initialRotation}>
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 100, Math.PI * 1.5]} />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 30]} />
          <meshNormalMaterial />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshNormalMaterial />
        </mesh>
      </group>
    )
  }

  

export function QuestionMarkBackground() {
  const questionMarks = useMemo(() => {
    const marks = []
    const count = 20 // Number of question marks

    for (let i = 0; i < count; i++) {
      marks.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        scale: Math.random() * 5 + 6, // Random scale between 0.5 and 2
        velocity: new Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        ),
        rotation: new Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          )
      })
    }
    return marks
  }, [])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }} style={{ background: '#1a1a1a' }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <StarField />
        {questionMarks.map((mark, index) => (
          <QuestionMark 
            key={index}
            initialPosition={mark.position}
            scale={mark.scale}
            initialVelocity={mark.velocity}
            initialRotation={mark.rotation}
          />
        ))}
      </Canvas>
    </div>
  )
}