"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Sample exercise data
const EXERCISES = [
  // Chest
  { id: 1, name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', 
    description: 'A compound exercise that targets the pectoralis major, anterior deltoids, and triceps.', 
    instructions: '1. Lie on a flat bench with feet firmly on the ground.\n2. Grip the barbell with hands slightly wider than shoulder-width.\n3. Lower the bar to your mid-chest.\n4. Press the bar back up to the starting position, extending your arms without locking the elbows.' },
  { id: 2, name: 'Push-Up', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', 
    description: 'A bodyweight exercise that targets the chest, shoulders, triceps, and core.',
    instructions: '1. Start in a plank position with hands slightly wider than shoulder-width.\n2. Keep your body in a straight line from head to heels.\n3. Lower your body until your chest nearly touches the floor.\n4. Push back up to the starting position.' },
  { id: 3, name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', 
    description: 'An isolation exercise that targets the pectoralis major with emphasis on stretching and contracting the chest.',
    instructions: '1. Lie on a flat bench holding dumbbells above your chest, palms facing each other.\n2. With a slight bend in your elbows, lower the dumbbells in an arc motion until you feel a stretch in your chest.\n3. Return to the starting position, squeezing your chest muscles.' },
  { id: 4, name: 'Cable Crossover', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate', 
    description: 'An isolation exercise that targets the pectoralis major with continuous tension throughout the movement.',
    instructions: '1. Stand between two cable stations with the pulleys set at upper positions.\n2. Grab the handles and step forward, creating tension in the cables.\n3. With a slight bend in your elbows, bring your hands together in front of your chest in an arcing motion.\n4. Slowly return to the starting position.' },
  
  // Back
  { id: 5, name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', 
    description: 'A compound exercise that targets the entire posterior chain, including lower back, glutes, hamstrings, and trapezius.',
    instructions: '1. Stand with feet hip-width apart, barbell over midfoot.\n2. Bend at hips and knees, grip the bar with hands shoulder-width apart.\n3. Keep your back flat, chest up, and lift the bar by extending hips and knees.\n4. Return the weight to the floor with control by hinging at the hips and bending the knees.' },
  { id: 6, name: 'Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate', 
    description: 'A compound bodyweight exercise that targets the latissimus dorsi, biceps, and middle back.',
    instructions: '1. Hang from a pull-up bar with hands slightly wider than shoulder-width, palms facing away.\n2. Pull your body up until your chin clears the bar.\n3. Lower yourself with control back to the starting position.\n4. Keep core engaged throughout the movement.' },
  { id: 7, name: 'Bent Over Row', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', 
    description: 'A compound exercise that targets the latissimus dorsi, rhomboids, and biceps.',
    instructions: '1. Stand with feet shoulder-width apart, knees slightly bent.\n2. Bend at the hips until your torso is nearly parallel to the floor.\n3. Grip the barbell with hands shoulder-width apart.\n4. Pull the bar to your lower ribcage, keeping elbows close to body.\n5. Lower the bar with control.' },
  { id: 8, name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', 
    description: 'A compound exercise that targets the latissimus dorsi and biceps.',
    instructions: '1. Sit at a lat pulldown machine with thighs secured under the pads.\n2. Grasp the bar with a wide grip, palms facing away.\n3. Pull the bar down to your upper chest while keeping your back slightly arched.\n4. Slowly return the bar to the starting position.' },
  
  // Shoulders
  { id: 9, name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', 
    description: 'A compound exercise that targets the deltoids, triceps, and trapezius.',
    instructions: '1. Stand with feet shoulder-width apart, holding a barbell at shoulder height.\n2. Press the bar overhead until your arms are fully extended.\n3. Lower the bar back to shoulder height with control.\n4. Keep core engaged and avoid arching your lower back.' },
  { id: 10, name: 'Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', 
    description: 'An isolation exercise that targets the lateral deltoids.',
    instructions: '1. Stand with feet shoulder-width apart, holding dumbbells at your sides.\n2. Raise the dumbbells out to the sides until they reach shoulder height.\n3. Keep a slight bend in your elbows throughout the movement.\n4. Lower the dumbbells with control.' },
  { id: 11, name: 'Face Pull', muscleGroup: 'shoulders', equipment: 'cable', difficulty: 'beginner', 
    description: 'A corrective exercise that targets the rear deltoids, middle trapezius, and rhomboids.',
    instructions: '1. Attach a rope to a cable pulley set at upper chest height.\n2. Grasp the rope with both hands and step back to create tension.\n3. Pull the rope toward your face, spreading the ends apart as you pull.\n4. Focus on squeezing your shoulder blades together.\n5. Return to starting position with control.' },
  
  // Arms
  { id: 12, name: 'Bicep Curl', muscleGroup: 'arms', equipment: 'dumbbell', difficulty: 'beginner', 
    description: 'An isolation exercise that targets the biceps brachii.',
    instructions: '1. Stand with feet shoulder-width apart, holding dumbbells at your sides, palms facing forward.\n2. Keeping upper arms stationary, bend at the elbows and curl the weights toward your shoulders.\n3. Slowly lower the weights back to the starting position.\n4. Avoid swinging or using momentum.' },
  { id: 13, name: 'Tricep Pushdown', muscleGroup: 'arms', equipment: 'cable', difficulty: 'beginner', 
    description: 'An isolation exercise that targets the triceps brachii.',
    instructions: '1. Stand facing a cable machine with a straight bar attachment at chest height.\n2. Grasp the bar with hands shoulder-width apart, palms facing down.\n3. Keeping your upper arms close to your sides, push the bar down until arms are fully extended.\n4. Slowly return the bar to starting position.' },
  { id: 14, name: 'Hammer Curl', muscleGroup: 'arms', equipment: 'dumbbell', difficulty: 'beginner', 
    description: 'A variation of the bicep curl that targets the brachialis and brachioradialis in addition to the biceps.',
    instructions: '1. Stand with feet shoulder-width apart, holding dumbbells at your sides with palms facing your body.\n2. Keeping upper arms stationary, bend at the elbows and curl the weights toward your shoulders.\n3. Maintain the neutral grip (thumbs pointing up) throughout the movement.\n4. Slowly lower the weights back to the starting position.' },
  
  // Legs
  { id: 15, name: 'Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', 
    description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
    instructions: '1. Stand with feet shoulder-width apart, barbell across upper back.\n2. Bend your knees and hips to lower your body as if sitting in a chair.\n3. Keep your chest up and back flat.\n4. Lower until thighs are parallel to the ground or as low as flexibility allows.\n5. Push through your heels to return to standing position.' },
  { id: 16, name: 'Lunges', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', 
    description: 'A unilateral exercise that targets the quadriceps, hamstrings, glutes, and improves balance.',
    instructions: '1. Stand with feet hip-width apart.\n2. Take a step forward with one leg and lower your body until both knees form approximately 90-degree angles.\n3. Push through the front heel to return to the starting position.\n4. Repeat with the opposite leg.\n5. Keep your torso upright throughout the movement.' },
  { id: 17, name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', 
    description: 'A compound movement that targets the hamstrings, glutes, and lower back.',
    instructions: '1. Stand with feet hip-width apart, holding a barbell in front of your thighs.\n2. Push your hips back while keeping a slight bend in your knees.\n3. Lower the bar while maintaining a flat back until you feel a stretch in your hamstrings.\n4. Drive your hips forward to return to the starting position.\n5. Keep the bar close to your legs throughout the movement.' },
  { id: 18, name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', 
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes with reduced lower back strain.',
    instructions: '1. Sit on the leg press machine with your back against the pad and feet on the platform shoulder-width apart.\n2. Release the safety catches and lower the platform by bending your knees toward your chest.\n3. Push through your heels to extend your legs back to the starting position without locking your knees.\n4. Keep your head and back against the pad throughout the movement.' },
  
  // Core
  { id: 19, name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', 
    description: 'An isometric exercise that targets the entire core, shoulders, and back.',
    instructions: '1. Start in a push-up position, then bend your arms to rest on your forearms.\n2. Form a straight line from your head to your heels.\n3. Keep your abs tight and avoid letting your hips sag or pike up.\n4. Hold the position for the desired duration while breathing normally.' },
  { id: 20, name: 'Russian Twist', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', 
    description: 'A rotational exercise that targets the obliques and helps develop core stability.',
    instructions: '1. Sit on the floor with knees bent and feet either on the floor or elevated.\n2. Lean back slightly to engage your core, maintaining a straight back.\n3. Clasp your hands together or hold a weight in front of your chest.\n4. Rotate your torso to the right, then to the left, touching the floor beside you with your hands.\n5. Continue alternating sides in a controlled manner.' },
  { id: 21, name: 'Hanging Leg Raise', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'intermediate', 
    description: 'A dynamic exercise that targets the lower abs and hip flexors while improving grip strength.',
    instructions: '1. Hang from a pull-up bar with an overhand grip, hands shoulder-width apart.\n2. Keep your shoulders engaged and away from your ears.\n3. Raise your legs together until they form a 90-degree angle with your torso.\n4. Lower your legs with control back to the starting position.\n5. Avoid swinging or using momentum.' },
  { id: 22, name: 'Ab Rollout', muscleGroup: 'core', equipment: 'ab wheel', difficulty: 'advanced', 
    description: 'A dynamic exercise that targets the entire core, shoulders, and lats while improving stability.',
    instructions: '1. Kneel on the floor holding an ab wheel beneath your shoulders.\n2. Slowly roll the wheel forward, extending your body as far as possible while maintaining a flat back.\n3. Use your core strength to pull the wheel back to the starting position.\n4. Keep your core engaged throughout the entire movement to avoid sagging hips.' },
];

const MUSCLE_GROUPS = [
  { id: 'all', name: 'All Muscle Groups' },
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'arms', name: 'Arms' },
  { id: 'legs', name: 'Legs' },
  { id: 'core', name: 'Core' },
];

const EQUIPMENT_TYPES = [
  { id: 'all', name: 'All Equipment' },
  { id: 'bodyweight', name: 'Bodyweight' },
  { id: 'dumbbell', name: 'Dumbbell' },
  { id: 'barbell', name: 'Barbell' },
  { id: 'cable', name: 'Cable' },
  { id: 'machine', name: 'Machine' },
  { id: 'ab wheel', name: 'Ab Wheel' },
];

const DIFFICULTY_LEVELS = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(exercise => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Muscle group filter
      const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
        exercise.muscleGroup === selectedMuscleGroup;
      
      // Equipment filter
      const matchesEquipment = selectedEquipment === 'all' || 
        exercise.equipment === selectedEquipment;
      
      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || 
        exercise.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesMuscleGroup && matchesEquipment && matchesDifficulty;
    });
  }, [searchQuery, selectedMuscleGroup, selectedEquipment, selectedDifficulty]);

  // Get the details of the selected exercise
  const exerciseDetails = selectedExercise 
    ? EXERCISES.find(exercise => exercise.id === selectedExercise) 
    : null;

  return (
    <div>
      {/* Exercise Details Modal */}
      {exerciseDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{exerciseDetails.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedExercise(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex space-x-2 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs capitalize">
                      {exerciseDetails.muscleGroup}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs capitalize">
                      {exerciseDetails.equipment}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs capitalize">
                      {exerciseDetails.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{exerciseDetails.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Instructions</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {exerciseDetails.instructions.split('\n').map((instruction, index) => (
                      <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">{instruction}</p>
                    ))}
                  </div>
                </div>

                {/* This would be where you'd add an image or video in a real app */}
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <InformationCircleIcon className="h-10 w-10 mx-auto mb-2" />
                    <p>Exercise demonstration would be shown here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises by name or description..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Muscle Group
              </label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {MUSCLE_GROUPS.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipment
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMuscleGroup('all');
                  setSelectedEquipment('all');
                  setSelectedDifficulty('all');
                }}
                variant="outline"
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Exercise Library
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredExercises.length} exercises found
          </span>
        </div>

        {filteredExercises.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No exercises found matching your criteria. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map(exercise => (
              <Card key={exercise.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedExercise(exercise.id)}
              >
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {exercise.name}
                  </h3>
                  <div className="flex space-x-2 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs capitalize">
                      {exercise.muscleGroup}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs capitalize">
                      {exercise.equipment}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs capitalize">
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {exercise.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExercise(exercise.id);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 